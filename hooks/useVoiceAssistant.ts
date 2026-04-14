
import { useState, useEffect, useRef, useCallback } from 'react';
import { Risk, likelihoods, impacts, riskStatuses, ConversationLogEntry, BatchRiskUpdate, controlEffectivenessOptions, ECCAssessment, BatchEccUpdate, ControlStatus, MaturityRating } from '../types';
import { GoogleGenAI, Type, FunctionDeclaration, LiveServerMessage, Modality, Blob } from "@google/genai";
import { ncaEccControls } from '../data/nca-ecc-controls';

// --- Audio Helper Functions for Live API ---
function decode(base64: string) { const binaryString = atob(base64); const len = binaryString.length; const bytes = new Uint8Array(len); for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); } return bytes; }
function encode(bytes: Uint8Array) { let binary = ''; const len = bytes.byteLength; for (let i = 0; i < len; i++) { binary += String.fromCharCode(bytes[i]); } return btoa(binary); }
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> { const dataInt16 = new Int16Array(data.buffer); const frameCount = dataInt16.length / numChannels; const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate); for (let channel = 0; channel < numChannels; channel++) { const channelData = buffer.getChannelData(channel); for (let i = 0; i < frameCount; i++) { channelData[i] = dataInt16[i * numChannels + channel] / 32768.0; } } return buffer; }
function createBlob(data: Float32Array): Blob { const l = data.length; const int16 = new Int16Array(l); for (let i = 0; i < l; i++) { int16[i] = data[i] * 32768; } return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }; }

// --- Type definitions ---
export type AssistantStatus = 'idle' | 'listening' | 'thinking' | 'speaking';
type AssessmentType = 'risk' | 'gap' | 'nca' | 'deploy' | 'audit' | null;
type Focus = { riskId?: string; controlId?: string; field: string };

interface UseVoiceAssistantProps {
  risks: Risk[];
  onBatchUpdateRisk: (id: string, updates: BatchRiskUpdate) => void;
  eccAssessments: ECCAssessment[];
  onBatchUpdateEcc: (id: string, updates: BatchEccUpdate) => void;
  onDeploy?: (target: string, notes: string) => void;
  onAssessmentRiskChange: (riskId: string | null) => void;
  onAssessmentControlChange: (controlId: string | null) => void;
  onAssessmentTypeChange: (type: AssessmentType) => void;
  onNavigate?: (view: any) => void;
  onUndoRisk: () => void;
  onRedoRisk: () => void;
  onUndoEcc: () => void;
  onRedoEcc: () => void;
}

interface ActiveAssessment { type: 'risk' | 'control'; id: string; }

// --- Function Declarations for Gemini ---
const setFocusFunction: FunctionDeclaration = { name: 'setFocus', description: "Sets UI focus on a risk field before asking about it or updating it. MUST be called before interacting with a field.", parameters: { type: Type.OBJECT, properties: { field: { type: Type.STRING, description: 'The field to focus on.', enum: ['RiskOwner', 'Status', 'Likelihood', 'Impact', 'ControlEffectiveness', 'MitigatingActions', 'GapDescription', 'RemediationPlan'] } }, required: ['field'] } };
const setEccFocusFunction: FunctionDeclaration = { 
    name: 'setEccFocus', 
    description: "Sets UI focus on an ECC control field or the control text itself. Call this before reading the control or asking about a field.", 
    parameters: { 
        type: Type.OBJECT, 
        properties: { 
            field: { 
                type: Type.STRING, 
                enum: ['controlName', 'status', 'maturity', 'recommendation', 'managementResponse', 'targetDate'] 
            } 
        }, 
        required: ['field'] 
    } 
};
const updateSingleRiskFieldFunction: FunctionDeclaration = {
    name: 'updateSingleRiskField',
    description: "Updates a single field for the current risk being assessed. Call this immediately after getting information for a field.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            field: {
                type: Type.STRING,
                description: 'The name of the field to update.',
                enum: ['Likelihood', 'Impact', 'MitigatingActions', 'RiskOwner', 'Status', 'ControlEffectiveness', 'GapDescription', 'RemediationPlan']
            },
            value: {
                type: Type.STRING,
                description: 'The new value for the field. For dropdowns, use the value, not the name (e.g., for Likelihood "Very Unlikely (1)", use "1"; for Status "In Progress", use "In Progress").'
            }
        },
        required: ['field', 'value']
    }
};
const updateSingleEccFieldFunction: FunctionDeclaration = {
    name: 'updateSingleEccField',
    description: "Updates a single field for the current ECC control being assessed. Call this immediately after getting information for a field.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            field: {
                type: Type.STRING,
                description: 'The name of the field to update.',
                enum: ['status', 'maturity', 'recommendation', 'managementResponse', 'targetDate']
            },
            value: {
                type: Type.STRING,
                description: 'The new value for the field. For dropdowns, use one of the allowed enum values.'
            }
        },
        required: ['field', 'value']
    }
};
const searchNcaControlsFunction: FunctionDeclaration = {
    name: 'searchNcaControls',
    description: "Searches the NCA ECC control library for controls relevant to a given query. Use this to find controls to link to a risk.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            query: { type: Type.STRING, description: 'Keywords or context to search for (e.g., "access control", "backup", "encryption").' }
        },
        required: ['query']
    }
};
const linkNcaEccControlsFunction: FunctionDeclaration = {
    name: 'linkNcaEccControls',
    description: "Links one or more NCA ECC controls to the current risk. Call this after finding relevant controls via search.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            controlCodes: {
                type: Type.ARRAY,
                description: "An array of control code strings to link (e.g., ['1.1.1', '2.3.4']).",
                items: { type: Type.STRING }
            }
        },
        required: ['controlCodes']
    }
};
const requestEvidenceFunction: FunctionDeclaration = {
    name: 'requestEvidence',
    description: "Requests the user to upload evidence for a specific claim. Use this when the user asserts a control is effective or implemented.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            reason: { type: Type.STRING, description: "The reason for requesting evidence (e.g., 'To verify the approval signature', 'To prove implementation')." }
        },
        required: ['reason']
    }
};
const completeAssessmentForItemFunction: FunctionDeclaration = {
    name: 'completeAssessmentForItem',
    description: "MUST be called after all fields for a single risk or control have been assessed and updated. Signals moving to the next item.",
    parameters: { type: Type.OBJECT, properties: {}, required: [] }
};
const deployDataFunction: FunctionDeclaration = { name: 'deployData', description: 'Deploys risk register data.', parameters: { type: Type.OBJECT, properties: { notes: { type: Type.STRING, description: 'Notes for deployment.' } }, required: ['notes'] } };
const navigateToFunction: FunctionDeclaration = {
    name: 'navigateTo',
    description: "Navigates the application to a specific view based on user request.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            view: {
                type: Type.STRING,
                enum: ['register', 'dashboard', 'gap', 'criteria', 'integrations', 'ecc', 'report', 'audit'],
                description: "The view to navigate to."
            }
        },
        required: ['view']
    }
};
const undoLastActionFunction: FunctionDeclaration = {
    name: 'undoLastAction',
    description: "Undoes the last change made to the risk or control data. Use this when the user asks to 'undo', 'revert', or 'go back'.",
    parameters: { type: Type.OBJECT, properties: {}, required: [] }
};
const redoLastActionFunction: FunctionDeclaration = {
    name: 'redoLastAction',
    description: "Redoes the last undone action. Use this when the user asks to 'redo'.",
    parameters: { type: Type.OBJECT, properties: {}, required: [] }
};

export const useVoiceAssistant = ({ 
    risks, 
    onBatchUpdateRisk, 
    eccAssessments, 
    onBatchUpdateEcc, 
    onDeploy, 
    onAssessmentRiskChange, 
    onAssessmentControlChange, 
    onAssessmentTypeChange, 
    onNavigate,
    onUndoRisk,
    onRedoRisk,
    onUndoEcc,
    onRedoEcc
}: UseVoiceAssistantProps) => {
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [status, setStatus] = useState<AssistantStatus>('idle');
  const [currentFocus, setCurrentFocus] = useState<Focus | null>(null);
  const [conversationLog, setConversationLog] = useState<ConversationLogEntry[]>([]);
  const [activeAssessment, setActiveAssessment] = useState<ActiveAssessment | null>(null);
  const [deploymentTarget, setDeploymentTarget] = useState<string | null>(null);
  
  // Refs for callbacks to avoid stale closures in Live API callbacks
  const onBatchUpdateRiskRef = useRef(onBatchUpdateRisk);
  const onBatchUpdateEccRef = useRef(onBatchUpdateEcc);
  const onUndoRiskRef = useRef(onUndoRisk);
  const onRedoRiskRef = useRef(onRedoRisk);
  const onUndoEccRef = useRef(onUndoEcc);
  const onRedoEccRef = useRef(onRedoEcc);
  const onDeployRef = useRef(onDeploy);
  const onNavigateRef = useRef(onNavigate);
  const onAssessmentRiskChangeRef = useRef(onAssessmentRiskChange);
  const onAssessmentControlChangeRef = useRef(onAssessmentControlChange);
  const activeAssessmentRef = useRef<ActiveAssessment | null>(null);

  useEffect(() => {
      onBatchUpdateRiskRef.current = onBatchUpdateRisk;
      onBatchUpdateEccRef.current = onBatchUpdateEcc;
      onUndoRiskRef.current = onUndoRisk;
      onRedoRiskRef.current = onRedoRisk;
      onUndoEccRef.current = onUndoEcc;
      onRedoEccRef.current = onRedoEcc;
      onDeployRef.current = onDeploy;
      onNavigateRef.current = onNavigate;
      onAssessmentRiskChangeRef.current = onAssessmentRiskChange;
      onAssessmentControlChangeRef.current = onAssessmentControlChange;
      activeAssessmentRef.current = activeAssessment;
  }, [onBatchUpdateRisk, onBatchUpdateEcc, onUndoRisk, onRedoRisk, onUndoEcc, onRedoEcc, onDeploy, onNavigate, onAssessmentRiskChange, onAssessmentControlChange, activeAssessment]);
  
  const ai = useRef<GoogleGenAI | null>(null);
  const sessionPromise = useRef<Promise<any> | null>(null);
  const assessmentQueue = useRef<string[]>([]);
  const isMounted = useRef(true);
  
  const inputAudioContext = useRef<AudioContext>(); const outputAudioContext = useRef<AudioContext>(); const micStream = useRef<MediaStream>(); const micSourceNode = useRef<MediaStreamAudioSourceNode>(); const scriptProcessorNode = useRef<ScriptProcessorNode>(); const audioPlaybackQueue = useRef(new Set<AudioBufferSourceNode>()); const nextAudioStartTime = useRef(0);
  const currentInputTranscription = useRef(''); const currentOutputTranscription = useRef('');

  const stopAssessment = useCallback(() => {
    if (!isAssistantActive) return;
    sessionPromise.current?.then(session => session.close());
    sessionPromise.current = null;
    micStream.current?.getTracks().forEach(track => track.stop());
    micSourceNode.current?.disconnect();
    scriptProcessorNode.current?.disconnect();
    inputAudioContext.current?.close().catch(console.error); inputAudioContext.current = undefined;
    audioPlaybackQueue.current.forEach(source => source.stop()); audioPlaybackQueue.current.clear();
    outputAudioContext.current?.close().catch(console.error); outputAudioContext.current = undefined;
    
    setIsAssistantActive(false); setStatus('idle'); setCurrentFocus(null); setActiveAssessment(null); 
    onAssessmentRiskChangeRef.current(null); onAssessmentControlChangeRef.current(null); onAssessmentTypeChange(null); 
    setDeploymentTarget(null); assessmentQueue.current = [];
  }, [isAssistantActive, onAssessmentTypeChange]);

  useEffect(() => {
    isMounted.current = true;
    if (process.env.API_KEY) ai.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return () => { isMounted.current = false; stopAssessment(); };
  }, [stopAssessment]);
  
  const addLogEntry = (entry: ConversationLogEntry) => { if (isMounted.current) setConversationLog(prev => [...prev, entry]); };
  const updateLastLogEntry = (text: string, speaker: 'user' | 'assistant') => { if (isMounted.current) setConversationLog(prev => { const newLog = [...prev]; const last = newLog[newLog.length - 1]; if (last?.speaker === speaker) { last.text = text; return newLog; } else { return [...newLog, { speaker, text }]; } }); };

  const processNextItem = useCallback(() => {
    if (assessmentQueue.current.length > 0) {
        const nextId = assessmentQueue.current.shift()!;
        
        let currentAssessmentType: 'risk' | 'control' | null = null;
        if (risks.some(r => r.id === nextId)) {
            currentAssessmentType = 'risk';
        } else if (eccAssessments.some(c => c.id === nextId)) {
            currentAssessmentType = 'control';
        }

        if (currentAssessmentType === 'risk') {
            const risk = risks.find(r => r.id === nextId)!;
            onAssessmentRiskChangeRef.current(nextId);
            setActiveAssessment({ type: 'risk', id: nextId });
            const prompt = `System: Start assessment for risk: ${risk.RiskID} - ${risk.RiskTitle}. The description is: "${risk.Description}".`;
            sessionPromise.current?.then(session => session.sendRealtimeInput({ text: prompt }));
        } else if (currentAssessmentType === 'control') {
            const control = eccAssessments.find(c => c.id === nextId)!;
            onAssessmentControlChangeRef.current(nextId);
            setActiveAssessment({ type: 'control', id: nextId });
            const prompt = `System: Start assessment for control ${control.controlCode}: ${control.controlName}.`;
            sessionPromise.current?.then(session => session.sendRealtimeInput({ text: prompt }));
        }
    } else {
        const completionMessage = "We have completed the assessment. Thank you!";
        addLogEntry({speaker: 'assistant', text: completionMessage});
        sessionPromise.current?.then(session => session.sendRealtimeInput({ text: completionMessage }));
        setTimeout(() => stopAssessment(), 5000);
    }
  }, [risks, eccAssessments, stopAssessment]);

  const startAssessment = async (type: AssessmentType = null, target?: string) => {
    if (!ai.current || !navigator.mediaDevices) return alert("AI client or media devices not available.");
    
    setConversationLog([]); 
    currentInputTranscription.current = ''; 
    currentOutputTranscription.current = '';
    nextAudioStartTime.current = 0;

    setIsAssistantActive(true); setStatus('listening'); onAssessmentTypeChange(type); setDeploymentTarget(target || null);

    let systemInstruction = `You are a versatile AI risk and compliance consultant.`;
    let tools: FunctionDeclaration[] = [navigateToFunction, undoLastActionFunction, redoLastActionFunction];

    if (type === 'nca') {
        assessmentQueue.current = eccAssessments.map(c => c.id);
        systemInstruction = `You are an AI assistant conducting an NCA ECC compliance assessment.
Your goal is to be helpful, proactive, and thorough.

Process for each control:
1.  **Focus & Read**: Call \`setEccFocus\` with 'controlName'. Then read the Control Code and Control Name clearly to the user.
2.  **Assess Fields**: For each field ('status', 'maturity', 'recommendation', 'managementResponse', 'targetDate'):
    a. Call \`setEccFocus\` with the field name to highlight it in the UI.
    b. **Propose**: 
       - For 'recommendation' and 'managementResponse': Generate a concise, professional draft based on the control's requirements. 
       - For 'status'/'maturity': If you can infer a likely status, suggest it. Otherwise, ask.
    c. **Challenge "Implemented"**: If the user claims the control is 'Implemented' or Maturity is Level 3 or higher:
       - DO NOT accept it immediately.
       - Ask: "Can you please upload the evidence for this? Is it signed and approved?"
       - Call \`requestEvidence\` to prompt the user to upload the file.
    d. **Update**: Call \`updateSingleEccField\` immediately when the user speaks so they see the result.
    e. **Confirm**: "I have updated [Field] to: [Value]. Is this correct?"
3.  **Next**: Once all fields are confirmed, call \`completeAssessmentForItem\`.`;
        tools.push(setEccFocusFunction, updateSingleEccFieldFunction, completeAssessmentForItemFunction, requestEvidenceFunction);
    } else if (type === 'deploy') {
        systemInstruction = `You are an AI deployment assistant for ${target}. Confirm the action with the user, ask for mandatory deployment notes, and then call \`deployData\`.`;
        tools.push(deployDataFunction);
    } else if (type === 'audit') {
        // Filter for high priority items or items marked as effective to verify evidence
        assessmentQueue.current = risks.filter(r => r.RiskLevel === 'High' || r.ControlEffectiveness === 'Effective').map(r => r.id);
        if (assessmentQueue.current.length === 0) {
             // If no high risks, just take the first 5 for sample audit
             assessmentQueue.current = risks.slice(0, 5).map(r => r.id);
        }

        systemInstruction = `You are a Lead GRC Auditor performing a formal Due Diligence Audit.
Your persona is strictly professional, skeptical, and thorough. You do NOT accept assertions without proof.

Audit Process for each item:
1.  **Announce**: "Audit Item [ID]: [Title]".
2.  **Verify Status**: Check 'Status' and 'ControlEffectiveness'.
3.  **Demand Evidence**: 
    - If the user claims a control is 'Effective', 'Strong' or 'Implemented', you MUST ask: "On what basis is this effective? Please provide the evidence."
    - Call the \`requestEvidence\` tool immediately to prompt for upload.
    - Ask: "Who approved this? Is there a signed artifact?"
4.  **Gap Check**: Compare 'MitigatingActions' with 'GapDescription'. If actions are listed but the gap remains, challenge the user.
5.  **Conclusion**: Based on the answers, either validate the rating or downgrade it using \`updateSingleRiskField\`.
6.  Call \`completeAssessmentForItem\` only when satisfied.`;
        tools.push(setFocusFunction, updateSingleRiskFieldFunction, completeAssessmentForItemFunction, requestEvidenceFunction);
    } else { // risk or gap
        assessmentQueue.current = risks.map(r => r.id);
        systemInstruction = `You are an AI GRC Auditor and Risk Consultant.
Your persona is a diligent, top-down auditor.

Process:
1. Announce the Risk ID and Title.
2. **Data Gathering**: For 'RiskOwner', 'Status', 'Likelihood', 'Impact', 'ControlEffectiveness':
    a. Call \`setFocus\`.
    b. Ask for the value.
    c. **Cross-Questioning (CRITICAL)**: 
       - If the user answers "Yes", "Implemented", "Effective", "Strong", or similar affirmative responses regarding controls:
       - **STOP.** Do not move on.
       - **Challenge them:** "I need to verify this. Who approved the implementation? Is there a signed document?"
       - **Demand Evidence:** "Please upload the evidence for this control effectiveness."
       - **Call Tool:** You MUST call \`requestEvidence\` immediately.
    d. Call \`updateSingleRiskField\` to record the value (e.g. 'Effective') ONLY after challenging them or if they insist.
3. **AI Suggestions & Linking**:
    a. Suggest 'MitigatingActions'/'RemediationPlan'. Call \`setFocus\` then \`updateSingleRiskField\`.
    b. **NCA Linking**: Use \`searchNcaControls\` to find relevant controls. Announce matches. Call \`linkNcaEccControls\` if agreed.
4. Call \`completeAssessmentForItem\`.`;
        tools.push(setFocusFunction, updateSingleRiskFieldFunction, completeAssessmentForItemFunction, searchNcaControlsFunction, linkNcaEccControlsFunction, requestEvidenceFunction);
    }

    inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    sessionPromise.current = ai.current.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }, systemInstruction, tools: [{ functionDeclarations: tools }], inputAudioTranscription: {}, outputAudioTranscription: {} },
        callbacks: {
            onopen: async () => {
                if (!isMounted.current) return;
                if (outputAudioContext.current?.state === 'suspended') await outputAudioContext.current.resume();

                micStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
                micSourceNode.current = inputAudioContext.current!.createMediaStreamSource(micStream.current);
                scriptProcessorNode.current = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
                scriptProcessorNode.current.onaudioprocess = (e) => sessionPromise.current?.then((s) => s.sendRealtimeInput({ media: createBlob(e.inputBuffer.getChannelData(0)) }));
                micSourceNode.current.connect(scriptProcessorNode.current); scriptProcessorNode.current.connect(inputAudioContext.current!.destination);
                
                if (type === 'deploy' && target) {
                    sessionPromise.current?.then(session => session.sendRealtimeInput({ text: `System: Start deployment process for ${target}.` }));
                } else if (type === null) {
                    // General navigation mode
                    sessionPromise.current?.then(session => session.sendRealtimeInput({ text: "System: Assistant ready. Waiting for user command." }));
                } else if (type === 'audit') {
                    sessionPromise.current?.then(session => session.sendRealtimeInput({ text: "System: Start formal due diligence audit. Prioritize high-risk items and evidence verification." }));
                    processNextItem();
                } else {
                    processNextItem();
                }
            },
            onmessage: async (message: LiveServerMessage) => {
                if (!isMounted.current) return;

                if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                    setStatus('speaking');
                    const audioCtx = outputAudioContext.current;
                    if (audioCtx) {
                        try {
                            nextAudioStartTime.current = Math.max(nextAudioStartTime.current, audioCtx.currentTime);
                        } catch (e) {
                            console.warn("Error accessing currentTime.", e);
                            return; 
                        }
                        const audioBuffer = await decodeAudioData(decode(message.serverContent.modelTurn.parts[0].inlineData.data), audioCtx, 24000, 1);
                        if (audioCtx.state === 'closed') return;

                        const source = audioCtx.createBufferSource();
                        source.buffer = audioBuffer; source.connect(audioCtx.destination);
                        source.addEventListener('ended', () => { 
                            if (!outputAudioContext.current || outputAudioContext.current.state === 'closed') return;
                            audioPlaybackQueue.current.delete(source); 
                            if (audioPlaybackQueue.current.size === 0) setStatus('listening'); 
                        });
                        source.start(nextAudioStartTime.current);
                        nextAudioStartTime.current += audioBuffer.duration;
                        audioPlaybackQueue.current.add(source);
                    }
                }

                if (message.serverContent?.inputTranscription) { setStatus('listening'); currentInputTranscription.current += message.serverContent.inputTranscription.text; updateLastLogEntry(currentInputTranscription.current, 'user'); }
                if (message.serverContent?.outputTranscription) { currentOutputTranscription.current += message.serverContent.outputTranscription.text; updateLastLogEntry(currentOutputTranscription.current, 'assistant'); }
                
                if (message.serverContent?.turnComplete) {
                    if (currentInputTranscription.current.trim()) addLogEntry({ speaker: 'user', text: currentInputTranscription.current.trim() });
                    if (currentOutputTranscription.current.trim()) addLogEntry({ speaker: 'assistant', text: currentOutputTranscription.current.trim() });
                    currentInputTranscription.current = ''; currentOutputTranscription.current = '';
                    if(audioPlaybackQueue.current.size === 0) setStatus('listening');
                }

                if (message.toolCall?.functionCalls) {
                    setStatus('thinking');
                    for (const fc of message.toolCall.functionCalls) {
                        let responsePayload: { result: string } = { result: "Unknown function." };
                        const currentActiveAssessment = activeAssessmentRef.current;
                        
                        if (fc.name === 'updateSingleRiskField' && currentActiveAssessment?.type === 'risk') {
                            const { field, value } = fc.args as { field: keyof BatchRiskUpdate, value: any };
                            onBatchUpdateRiskRef.current(currentActiveAssessment.id, { [field]: value });
                            responsePayload = { result: `OK, ${field} updated.` };
                        } 
                        else if (fc.name === 'updateSingleEccField' && currentActiveAssessment?.type === 'control') {
                            const { field, value } = fc.args as { field: keyof BatchEccUpdate, value: any };
                            onBatchUpdateEccRef.current(currentActiveAssessment.id, { [field]: value });
                            responsePayload = { result: `OK, ${field} updated.` };
                        }
                        else if (fc.name === 'completeAssessmentForItem' && currentActiveAssessment) {
                            processNextItem();
                            responsePayload = { result: "OK, proceeding to next item." };
                        }
                        else if (fc.name === 'setFocus' && currentActiveAssessment?.type === 'risk') {
                            setCurrentFocus({ riskId: currentActiveAssessment.id, field: (fc.args as any).field });
                            responsePayload = { result: "OK, focus set." };
                        }
                        else if (fc.name === 'setEccFocus' && currentActiveAssessment?.type === 'control') {
                            setCurrentFocus({ controlId: currentActiveAssessment.id, field: (fc.args as any).field });
                            responsePayload = { result: "OK, focus set." };
                        }
                        else if (fc.name === 'searchNcaControls') {
                            const { query } = fc.args as { query: string };
                            const lowerQuery = query.toLowerCase();
                            // Simple text search logic
                            const matches = ncaEccControls.filter(c => 
                                c.controlCode.toLowerCase().includes(lowerQuery) || 
                                c.controlName.toLowerCase().includes(lowerQuery) ||
                                c.subDomainName.toLowerCase().includes(lowerQuery)
                            ).slice(0, 10); // Limit results to avoid large context payload
                            responsePayload = { result: JSON.stringify(matches.map(c => ({ code: c.controlCode, name: c.controlName }))) };
                        }
                        else if (fc.name === 'linkNcaEccControls' && currentActiveAssessment?.type === 'risk') {
                            const { controlCodes } = fc.args as { controlCodes: string[] };
                            onBatchUpdateRiskRef.current(currentActiveAssessment.id, { linkedControls: controlCodes });
                            responsePayload = { result: `OK, linked controls: ${controlCodes.join(', ')}.` };
                        }
                        else if (fc.name === 'requestEvidence') {
                            const { reason } = fc.args as { reason: string };
                            // We don't trigger a state change here other than logging, as the user handles upload manually in the UI
                            // But we can update the log to signal the UI
                            addLogEntry({ speaker: 'assistant', text: `[SYSTEM] Evidence requested: ${reason}` });
                            responsePayload = { result: `OK, I have requested the user to upload evidence for reason: ${reason}.` };
                        }
                        else if (fc.name === 'deployData' && onDeployRef.current) {
                            onDeployRef.current(deploymentTarget!, (fc.args as any).notes);
                            responsePayload = { result: "OK, deployment initiated." };
                            setTimeout(() => stopAssessment(), 5000);
                        }
                        else if (fc.name === 'navigateTo' && onNavigateRef.current) {
                            onNavigateRef.current((fc.args as any).view);
                            responsePayload = { result: `OK, navigated to ${(fc.args as any).view}.` };
                        }
                        else if (fc.name === 'undoLastAction') {
                            if (type === 'nca') {
                                onUndoEccRef.current();
                                responsePayload = { result: "OK, undid last NCA assessment change." };
                            } else {
                                onUndoRiskRef.current();
                                responsePayload = { result: "OK, undid last risk assessment change." };
                            }
                        }
                        else if (fc.name === 'redoLastAction') {
                            if (type === 'nca') {
                                onRedoEccRef.current();
                                responsePayload = { result: "OK, redid last NCA assessment change." };
                            } else {
                                onRedoRiskRef.current();
                                responsePayload = { result: "OK, redid last risk assessment change." };
                            }
                        }

                        sessionPromise.current?.then(s => s.sendToolResponse({ functionResponses: { id: fc.id, name: fc.name, response: responsePayload } }));
                    }
                }
            },
            onerror: (e: ErrorEvent) => {
                console.error('Live session error:', e.message, e);
                stopAssessment();
            },
            onclose: (e: CloseEvent) => {
                console.debug('Live session closed.', e.code, e.reason);
                stopAssessment();
            },
        }
    });
  };

  return { assistantStatus: status, isAssistantActive, startAssessment, stopAssessment, currentFocus, conversationLog };
};
