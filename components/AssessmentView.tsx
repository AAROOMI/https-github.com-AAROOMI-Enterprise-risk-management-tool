
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Risk, likelihoods, impacts, riskStatuses, controlEffectivenessOptions, riskCategories, ConversationLogEntry } from '../types';
import { MicrophoneIcon, MicrophoneOffIcon, ShieldCheckIcon, UploadIcon, MagicIcon } from './icons';
import { AssistantStatus } from '../hooks/useVoiceAssistant';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { ncaEccControls } from '../data/nca-ecc-controls';
import { GoogleGenAI } from "@google/genai";

interface AssessmentViewProps {
  activeRisk: Risk;
  onUpdateField: (riskId: string, updates: Partial<Risk>) => void;
  onStopAssessment: () => void;
  assistantStatus: AssistantStatus;
  conversationLog: ConversationLogEntry[];
  currentFocus: { riskId: string; field: string } | null;
}

// Re-usable form components
const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-cyan-300 mb-1">{label}</label>
        {children}
    </div>
);
const TextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
    <input {...props} className={`w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition ${className || ''}`} />
);
const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
    <textarea {...props} className={`w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition min-h-[80px] resize-y ${className || ''}`} />
);
const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, ...props }) => (
    <select {...props} className={`w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition ${className || ''}`}>
        {props.children}
    </select>
);

const AssistantPanel: React.FC<{ status: AssistantStatus; log: ConversationLogEntry[]; currentFocus: { riskId: string; field: string } | null; }> = ({ status, log, currentFocus }) => {
    const messagesEndRef = React.useRef<null | HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    React.useEffect(scrollToBottom, [log]);

    const statusConfig = {
        idle: { color: 'bg-gray-500/50', text: 'Assistant Idle' },
        listening: { color: 'bg-cyan-500', text: 'Listening...' },
        thinking: { color: 'bg-yellow-500', text: 'Thinking...' },
        speaking: { color: 'bg-green-500', text: 'Speaking...' },
    };
    const { color, text } = statusConfig[status];

    return (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg flex flex-col h-full">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between flex-shrink-0">
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${color}`}>
                        <MicrophoneIcon className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-semibold text-cyan-300">{text}</p>
                </div>
                {currentFocus?.field && (
                    <div className="text-xs text-gray-400 bg-slate-800 px-2 py-1 rounded-md animate-pulse">
                        Focus: <span className="font-semibold text-cyan-400">{currentFocus.field}</span>
                    </div>
                )}
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {log.map((entry, index) => (
                    <div key={index} className={`flex items-end gap-2 ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {entry.speaker === 'assistant' && <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex-shrink-0" title="Assistant"></div>}
                        <div className={`max-w-[85%] px-3 py-2 rounded-lg ${entry.speaker === 'user' ? 'bg-cyan-500 text-white rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                            <p className="text-sm">{entry.text}</p>
                        </div>
                        {entry.speaker === 'user' && <div className="w-6 h-6 rounded-full bg-gray-600/50 flex-shrink-0" title="User"></div>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

const AssessmentView: React.FC<AssessmentViewProps> = ({ activeRisk, onUpdateField, onStopAssessment, assistantStatus, conversationLog, currentFocus }) => {
    
    const [activeDictationField, setActiveDictationField] = useState<keyof Risk | null>(null);
    const baseTextRef = useRef('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isEvidenceRequested, setIsEvidenceRequested] = useState(false);

    // Scroll ref map
    const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const handleChange = (field: keyof Risk, value: any) => {
        onUpdateField(activeRisk.id, { [field]: value });
    };

    const handleTranscript = useCallback((transcript: string) => {
        if (activeDictationField) {
            handleChange(activeDictationField, baseTextRef.current + transcript);
        }
    }, [activeDictationField, activeRisk]);

    const handleFinalTranscript = useCallback((transcript: string) => {
        if (activeDictationField) {
            const newText = (baseTextRef.current + transcript.trim() + ' ').trim();
            baseTextRef.current = newText ? newText + ' ' : '';
            handleChange(activeDictationField, newText);
        }
    }, [activeDictationField, activeRisk]);

    const { isListening, toggleListening, isSupported } = useSpeechToText({
        onTranscript: handleTranscript,
        onFinalTranscript: handleFinalTranscript,
    });

    useEffect(() => {
        if (!isListening && activeDictationField) {
            setActiveDictationField(null);
        }
    }, [isListening]);

    // Check logs for evidence request
    useEffect(() => {
        if (conversationLog.length > 0) {
            const lastEntry = conversationLog[conversationLog.length - 1];
            if (lastEntry.speaker === 'assistant' && (lastEntry.text.includes("[SYSTEM] Evidence requested") || lastEntry.text.toLowerCase().includes("upload"))) {
                setIsEvidenceRequested(true);
                // Clear the highlight after 10 seconds
                setTimeout(() => setIsEvidenceRequested(false), 10000);
            }
        }
    }, [conversationLog]);

    // Auto-scroll to focused field
    useEffect(() => {
        if (currentFocus?.field && fieldRefs.current[currentFocus.field]) {
            fieldRefs.current[currentFocus.field]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [currentFocus]);

    const handleDictationClick = (field: keyof Risk) => {
        if (isListening && activeDictationField === field) {
            toggleListening();
        } else {
            if (isListening) {
                toggleListening();
            }
            setActiveDictationField(field);
            baseTextRef.current = activeRisk?.[field] ? `${activeRisk[field]} ` : '';
            setTimeout(toggleListening, 100);
        }
    };

    const isFieldFocused = (fieldName: string): boolean => {
        if (!currentFocus || !activeRisk) return false;
        return currentFocus.riskId === activeRisk.id && currentFocus.field === fieldName;
    };

    const SpeechButton: React.FC<{field: keyof Risk}> = ({field}) => {
        if (!isSupported) return null;
        return (
            <button 
                type="button" 
                onClick={() => handleDictationClick(field)}
                title="Dictate text"
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors ${isListening && activeDictationField === field ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}
            >
                <MicrophoneIcon className="h-4 w-4"/>
            </button>
        )
    };

    const handleUnlinkControl = (code: string) => {
        const currentControls = activeRisk.linkedControls || [];
        const newControls = currentControls.filter(c => c !== code);
        handleChange('linkedControls', newControls);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                handleChange('evidenceFile', {
                    name: file.name,
                    type: file.type,
                    data: base64,
                    analysis: "Pending AI review..." // Placeholder
                });
                setIsEvidenceRequested(false); // Clear highlight on upload
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleGenerateAnalysis = async () => {
        if (!process.env.API_KEY) {
            alert("API Key not found. Please check your environment configuration.");
            return;
        }
        setIsAnalyzing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are a senior Risk Analyst. Please analyze the following risk and provide a comprehensive summary.
                
                Risk Context:
                - ID: ${activeRisk.RiskID}
                - Title: ${activeRisk.RiskTitle}
                - Description: ${activeRisk.Description}
                - Likelihood: ${activeRisk.Likelihood}
                - Impact: ${activeRisk.Impact}
                - Owner: ${activeRisk.RiskOwner}
                
                Your analysis should include:
                1. A concise **Risk Summary**.
                2. Potential **Business Impacts** if this risk materializes.
                3. Recommended **Mitigation Strategies** based on industry best practices.
                
                Format the output in clear Markdown.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            if (response.text) {
                handleChange('aiAnalysis', response.text);
            }
        } catch (error) {
            console.error("Analysis generation failed:", error);
            alert("Failed to generate analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            <header className="flex-shrink-0 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-cyan-500">AI-Led Assessment</h1>
                    <p className="text-gray-400">Assessing Risk: <span className="font-semibold text-cyan-200">{activeRisk.RiskID} - {activeRisk.RiskTitle}</span></p>
                </div>
                <button
                    onClick={onStopAssessment}
                    className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow-md bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30 transition-all duration-300"
                >
                    <MicrophoneOffIcon /> Stop Assessment
                </button>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                <div className="lg:col-span-2 overflow-y-auto pr-4 space-y-6 scroll-smooth">
                    {/* Risk Details Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-lg border border-white/10">
                         <FormField label="Risk ID">
                            <TextInput value={activeRisk.RiskID} disabled />
                        </FormField>
                         <div ref={el => fieldRefs.current['RiskTitle'] = el}>
                             <FormField label="Risk Title">
                                 <div className="relative">
                                    <TextInput value={activeRisk.RiskTitle} onChange={(e) => handleChange('RiskTitle', e.target.value)} className={isFieldFocused('RiskTitle') ? 'field-glow' : ''} />
                                    <SpeechButton field="RiskTitle" />
                                </div>
                            </FormField>
                        </div>
                        <FormField label="Risk Type">
                             <Select value={activeRisk.Type} onChange={(e) => handleChange('Type', e.target.value)}>
                                {riskCategories.map(cat => <option key={cat} className="bg-gray-800" value={cat}>{cat}</option>)}
                            </Select>
                        </FormField>
                        <div ref={el => fieldRefs.current['Description'] = el} className="md:col-span-2">
                            <FormField label="Description">
                                <div className="relative">
                                    <TextArea value={activeRisk.Description} onChange={(e) => handleChange('Description', e.target.value)} className={isFieldFocused('Description') ? 'field-glow' : ''} />
                                    <SpeechButton field="Description" />
                                </div>
                            </FormField>
                        </div>
                        <div className="md:col-span-1">
                            <FormField label="Description (English)">
                                <div className="relative">
                                    <TextArea value={activeRisk.DescriptionEN || ''} onChange={(e) => handleChange('DescriptionEN', e.target.value)} className={isFieldFocused('DescriptionEN') ? 'field-glow' : ''} />
                                    <SpeechButton field="DescriptionEN" />
                                </div>
                            </FormField>
                        </div>
                        <div className="md:col-span-1">
                            <FormField label="Description (Arabic)">
                                <div className="relative">
                                    <TextArea value={activeRisk.DescriptionAR || ''} onChange={(e) => handleChange('DescriptionAR', e.target.value)} className={`text-right ${isFieldFocused('DescriptionAR') ? 'field-glow' : ''}`} dir="rtl" />
                                    <SpeechButton field="DescriptionAR" />
                                </div>
                            </FormField>
                        </div>
                        <div ref={el => fieldRefs.current['RiskOwner'] = el}>
                            <FormField label="Risk Owner">
                                <div className="relative">
                                    <TextInput value={activeRisk.RiskOwner} onChange={(e) => handleChange('RiskOwner', e.target.value)} className={isFieldFocused('RiskOwner') ? 'field-glow' : ''} />
                                    <SpeechButton field="RiskOwner" />
                                </div>
                            </FormField>
                        </div>
                        <div ref={el => fieldRefs.current['Status'] = el}>
                            <FormField label="Status">
                                <Select value={activeRisk.Status} onChange={(e) => handleChange('Status', e.target.value)} className={isFieldFocused('Status') ? 'field-glow' : ''}>
                                    {riskStatuses.map(s => <option key={s} className="bg-gray-800" value={s}>{s}</option>)}
                                </Select>
                            </FormField>
                        </div>
                        <div ref={el => fieldRefs.current['Likelihood'] = el}>
                            <FormField label="Likelihood">
                                 <Select value={activeRisk.Likelihood} onChange={(e) => handleChange('Likelihood', e.target.value)} className={isFieldFocused('Likelihood') ? 'field-glow' : ''}>
                                    <option className="bg-gray-800" value="">Select...</option>
                                    {likelihoods.map(l => <option key={l.value} className="bg-gray-800" value={l.value}>{l.name}</option>)}
                                </Select>
                            </FormField>
                        </div>
                        <div ref={el => fieldRefs.current['Impact'] = el}>
                            <FormField label="Impact">
                                <Select value={activeRisk.Impact} onChange={(e) => handleChange('Impact', e.target.value)} className={isFieldFocused('Impact') ? 'field-glow' : ''}>
                                     <option className="bg-gray-800" value="">Select...</option>
                                    {impacts.map(i => <option key={i.value} className="bg-gray-800" value={i.value}>{i.name}</option>)}
                                </Select>
                            </FormField>
                        </div>
                        <div ref={el => fieldRefs.current['MitigatingActions'] = el} className="md:col-span-2">
                            <FormField label="Mitigating Actions">
                                <div className="relative">
                                    <TextArea value={activeRisk.MitigatingActions} onChange={(e) => handleChange('MitigatingActions', e.target.value)} className={isFieldFocused('MitigatingActions') ? 'field-glow' : ''} />
                                    <SpeechButton field="MitigatingActions" />
                                </div>
                            </FormField>
                        </div>

                        {/* Additional Metrics Section */}
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                            <div ref={el => fieldRefs.current['KRI'] = el}>
                                <FormField label="Key Risk Indicator (KRI)">
                                    <div className="relative">
                                        <TextInput value={activeRisk.KRI || ''} onChange={(e) => handleChange('KRI', e.target.value)} className={isFieldFocused('KRI') ? 'field-glow' : ''} placeholder="e.g. System Uptime < 99.9%" />
                                        <SpeechButton field="KRI" />
                                    </div>
                                </FormField>
                            </div>
                            <div ref={el => fieldRefs.current['RPN'] = el}>
                                <FormField label="FMEA RPN Score">
                                    <TextInput type="number" value={activeRisk.RPN || ''} onChange={(e) => handleChange('RPN', parseInt(e.target.value, 10))} className={isFieldFocused('RPN') ? 'field-glow' : ''} placeholder="Likelihood x Impact x Detection" />
                                </FormField>
                            </div>
                            <div ref={el => fieldRefs.current['LeadTrigger'] = el}>
                                <FormField label="Lead Trigger (Proactive)">
                                    <div className="relative">
                                        <TextInput value={activeRisk.LeadTrigger || ''} onChange={(e) => handleChange('LeadTrigger', e.target.value)} className={`border-green-500/50 focus:ring-green-500 ${isFieldFocused('LeadTrigger') ? 'field-glow' : ''}`} placeholder="Early warning indicator" />
                                        <SpeechButton field="LeadTrigger" />
                                    </div>
                                </FormField>
                            </div>
                            <div ref={el => fieldRefs.current['LagTrigger'] = el}>
                                <FormField label="Lag Trigger (Reactive)">
                                    <div className="relative">
                                        <TextInput value={activeRisk.LagTrigger || ''} onChange={(e) => handleChange('LagTrigger', e.target.value)} className={`border-orange-500/50 focus:ring-orange-500 ${isFieldFocused('LagTrigger') ? 'field-glow' : ''}`} placeholder="Outcome indicator" />
                                        <SpeechButton field="LagTrigger" />
                                    </div>
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* AI Risk Analysis Section */}
                    <div className="p-6 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-lg border border-indigo-500/30 space-y-4">
                        <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                            <div className="flex items-center gap-2">
                                <MagicIcon className="text-purple-400 h-5 w-5" />
                                <h3 className="text-lg font-semibold text-purple-200">AI Risk Analysis</h3>
                            </div>
                            <button 
                                onClick={handleGenerateAnalysis} 
                                disabled={isAnalyzing}
                                className="px-3 py-1.5 bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold rounded-md flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <MagicIcon className="h-3 w-3" />
                                        Generate Analysis
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="relative">
                            <TextArea 
                                value={activeRisk.aiAnalysis || ''} 
                                onChange={(e) => handleChange('aiAnalysis', e.target.value)} 
                                placeholder="Click 'Generate Analysis' to get an AI-powered summary, impact assessment, and mitigation recommendations based on the current risk data."
                                className="min-h-[150px] bg-slate-900/60 border-indigo-500/20 focus:border-purple-500 font-mono text-sm"
                            />
                        </div>
                    </div>

                    {/* Gap Assessment Form */}
                     <div className="p-6 bg-white/5 rounded-lg border border-white/10 space-y-4">
                        <h3 className="text-lg font-semibold text-cyan-200 border-b border-slate-700 pb-2">Gap Assessment</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div ref={el => fieldRefs.current['ControlEffectiveness'] = el}>
                                <FormField label="Control Effectiveness">
                                    <Select value={activeRisk.ControlEffectiveness} onChange={(e) => handleChange('ControlEffectiveness', e.target.value)} className={isFieldFocused('ControlEffectiveness') ? 'field-glow' : ''}>
                                        {controlEffectivenessOptions.map(opt => <option key={opt} className="bg-gray-800" value={opt}>{opt}</option>)}
                                    </Select>
                                </FormField>
                            </div>
                            <div ref={el => fieldRefs.current['GapDescription'] = el} className="md:col-span-2">
                                <FormField label="Gap Description">
                                     <div className="relative">
                                        <TextArea value={activeRisk.GapDescription} onChange={(e) => handleChange('GapDescription', e.target.value)} className={isFieldFocused('GapDescription') ? 'field-glow' : ''} />
                                        <SpeechButton field="GapDescription" />
                                    </div>
                                </FormField>
                            </div>
                            <div ref={el => fieldRefs.current['RemediationPlan'] = el} className="md:col-span-3">
                                <FormField label="Remediation Plan">
                                    <div className="relative">
                                        <TextArea value={activeRisk.RemediationPlan} onChange={(e) => handleChange('RemediationPlan', e.target.value)} className={isFieldFocused('RemediationPlan') ? 'field-glow' : ''} />
                                        <SpeechButton field="RemediationPlan" />
                                    </div>
                                </FormField>
                            </div>
                        </div>
                     </div>
                     
                     {/* Evidence Upload Section */}
                     <div className={`p-6 rounded-lg border transition-all duration-500 ${isEvidenceRequested ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse' : 'bg-white/5 border-white/10'} space-y-4`}>
                        <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                             <UploadIcon className={`h-5 w-5 ${isEvidenceRequested ? 'text-white' : 'text-cyan-400'}`} />
                             <h3 className={`text-lg font-semibold ${isEvidenceRequested ? 'text-white' : 'text-cyan-200'}`}>Evidence & Documentation</h3>
                        </div>
                        <div className="flex items-center gap-4">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept="image/*,application/pdf"
                            />
                            <button 
                                onClick={triggerFileUpload}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${isEvidenceRequested ? 'bg-cyan-500 hover:bg-cyan-600 text-white animate-bounce' : 'bg-slate-700 hover:bg-slate-600'}`}
                            >
                                <UploadIcon className="h-4 w-4" />
                                {isEvidenceRequested ? "UPLOAD EVIDENCE NOW" : "Upload Evidence"}
                            </button>
                            {activeRisk.evidenceFile ? (
                                <div className="flex items-center gap-2 text-sm bg-green-900/30 text-green-300 px-3 py-1 rounded-full border border-green-500/30">
                                    <span className="font-semibold">✓ Uploaded:</span> {activeRisk.evidenceFile.name}
                                </div>
                            ) : (
                                <span className={`text-sm italic ${isEvidenceRequested ? 'text-cyan-200' : 'text-gray-500'}`}>{isEvidenceRequested ? "Waiting for file..." : "No evidence uploaded yet."}</span>
                            )}
                        </div>
                     </div>

                     {/* Linked Controls Section */}
                     <div className="p-6 bg-white/5 rounded-lg border border-white/10 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                             <ShieldCheckIcon className="text-cyan-400 h-5 w-5" />
                             <h3 className="text-lg font-semibold text-cyan-200">Linked NCA ECC Controls</h3>
                        </div>
                        {activeRisk.linkedControls && activeRisk.linkedControls.length > 0 ? (
                            <div className="space-y-2">
                                {activeRisk.linkedControls.map(code => {
                                    const control = ncaEccControls.find(c => c.controlCode === code);
                                    return (
                                        <div key={code} className="flex items-start justify-between bg-slate-900/50 p-3 rounded-md border border-slate-700">
                                            <div>
                                                <span className="font-bold text-cyan-400 block">{code}</span>
                                                <span className="text-sm text-gray-300">{control?.controlName || 'Unknown Control'}</span>
                                            </div>
                                            <button 
                                                onClick={() => handleUnlinkControl(code)} 
                                                className="text-red-400 hover:text-red-300 ml-4 p-1"
                                                title="Unlink Control"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-400 text-sm italic">No controls linked yet. The AI assistant will suggest relevant controls during the assessment.</p>
                        )}
                     </div>
                </div>
                <div className="lg:col-span-1 overflow-hidden h-full">
                    <AssistantPanel status={assistantStatus} log={conversationLog} currentFocus={currentFocus} />
                </div>
            </main>
        </div>
    );
};

export default AssessmentView;
