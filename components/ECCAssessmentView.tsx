
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ECCAssessment, ControlStatus, MaturityRating, ConversationLogEntry } from '../types';
import { MicrophoneIcon } from './icons';
import { AssistantStatus } from '../hooks/useVoiceAssistant';
import ECCAssessmentForm from './ECCAssessmentForm';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface ECCAssessmentViewProps {
    assessments: ECCAssessment[];
    onUpdateAssessment: (id: string, updates: Partial<ECCAssessment>) => void;
    onStartAssessment: () => void;
    isAssistantActive: boolean;
    assistantStatus: AssistantStatus;
    conversationLog: ConversationLogEntry[];
    currentFocus: { riskId?: string, controlId?: string, field: string } | null;
    activeControlId: string | null;
}

const controlStatuses = Object.values(ControlStatus);
const maturityRatings = Object.values(MaturityRating);

const AssistantPanel: React.FC<{ status: AssistantStatus; log: ConversationLogEntry[]; }> = ({ status, log }) => {
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [log]);

    const statusConfig = {
        idle: { color: 'bg-gray-500/50', text: 'Assistant Idle' },
        listening: { color: 'bg-cyan-500', text: 'Listening...' },
        thinking: { color: 'bg-yellow-500', text: 'Thinking...' },
        speaking: { color: 'bg-green-500', text: 'Speaking...' },
    };
    const { color, text } = statusConfig[status];

    return (
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg flex flex-col h-full">
            <div className="p-4 border-b border-slate-700 flex items-center gap-3 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${color}`}><MicrophoneIcon className="h-5 w-5 text-white" /></div>
                <p className="font-semibold text-cyan-300">{text}</p>
            </div>
            <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {log.map((entry, index) => (
                    <div key={index} className={`flex items-end gap-2 ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {entry.speaker === 'assistant' && <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex-shrink-0" title="Assistant"></div>}
                        <div className={`max-w-[85%] px-3 py-2 rounded-lg ${entry.speaker === 'user' ? 'bg-cyan-500 text-white rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}><p className="text-sm">{entry.text}</p></div>
                        {entry.speaker === 'user' && <div className="w-6 h-6 rounded-full bg-gray-600/50 flex-shrink-0" title="User"></div>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};


const ECCAssessmentView: React.FC<ECCAssessmentViewProps> = ({ assessments, onUpdateAssessment, onStartAssessment, isAssistantActive, assistantStatus, conversationLog, currentFocus, activeControlId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeDictationTarget, setActiveDictationTarget] = useState<{ id: string; field: keyof ECCAssessment } | null>(null);
    const baseTextRef = useRef('');
    
    const handleTranscript = useCallback((transcript: string) => {
        if (activeDictationTarget) {
            onUpdateAssessment(activeDictationTarget.id, { [activeDictationTarget.field]: baseTextRef.current + transcript });
        }
    }, [activeDictationTarget, onUpdateAssessment]);

    const handleFinalTranscript = useCallback((transcript: string) => {
        if (activeDictationTarget) {
            const newText = (baseTextRef.current + transcript.trim() + ' ').trim();
            baseTextRef.current = newText ? newText + ' ' : '';
            onUpdateAssessment(activeDictationTarget.id, { [activeDictationTarget.field]: newText });
        }
    }, [activeDictationTarget, onUpdateAssessment]);

    const { isListening, toggleListening, isSupported } = useSpeechToText({
        onTranscript: handleTranscript,
        onFinalTranscript: handleFinalTranscript,
    });

    useEffect(() => {
        if (!isListening && activeDictationTarget) {
            setActiveDictationTarget(null);
        }
    }, [isListening]);

    const handleDictationClick = (id: string, field: keyof ECCAssessment, currentValue: string) => {
        if (isListening && activeDictationTarget?.id === id && activeDictationTarget?.field === field) {
            toggleListening();
        } else {
            if (isListening) {
                toggleListening();
            }
            setActiveDictationTarget({ id, field });
            baseTextRef.current = currentValue ? `${currentValue} ` : '';
            setTimeout(toggleListening, 100);
        }
    };

    const activeControl = useMemo(() => {
        if (!activeControlId) return null;
        return assessments.find(c => c.id === activeControlId);
    }, [activeControlId, assessments]);

    const filteredControls = useMemo(() => {
        if (!searchTerm) return assessments;
        const lowercasedFilter = searchTerm.toLowerCase();
        return assessments.filter(control =>
            control.controlCode.toLowerCase().includes(lowercasedFilter) ||
            control.controlName.toLowerCase().includes(lowercasedFilter) ||
            control.domainName.toLowerCase().includes(lowercasedFilter) ||
            control.subDomainName.toLowerCase().includes(lowercasedFilter)
        );
    }, [searchTerm, assessments]);

    const groupedControls = useMemo(() => {
        const grouped = filteredControls.reduce((acc, control) => {
            const domain = control.domainName;
            if (!acc[domain]) { acc[domain] = []; }
            acc[domain].push(control);
            return acc;
        }, {} as Record<string, ECCAssessment[]>);
        
        return Object.entries(grouped).sort(([, controlsA], [, controlsB]) => {
            const domainCodeA = parseInt(controlsA[0].domainCode, 10);
            const domainCodeB = parseInt(controlsB[0].domainCode, 10);
            return domainCodeA - domainCodeB;
        });
    }, [filteredControls]);

    const tableView = (
        <div className="space-y-8">
            {groupedControls.length > 0 ? groupedControls.map(([domainName, controlsInDomain]) => (
                <div key={domainName}>
                    <h2 className="text-xl font-semibold text-cyan-200 mb-3 sticky top-0 bg-slate-800/80 backdrop-blur-sm py-2 px-2 z-10 rounded-t-lg">{domainName}</h2>
                     <div className="overflow-x-auto rounded-b-lg border border-cyan-500/20 border-t-0">
                        <table className="min-w-full text-sm text-gray-300">
                            <thead className="bg-white/10">
                                <tr>
                                    {["Code", "Control Name", "Sub-Domain", "Status", "Maturity", "Recommendation", "Mgmt. Response", "Target Date"].map(h => 
                                        <th key={h} className="p-3 font-semibold text-left text-cyan-200">{h}</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-cyan-500/10">
                                {controlsInDomain.map((control) => (
                                    <tr key={control.id} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="p-2 align-top font-mono font-semibold w-24">{control.controlCode}</td>
                                        <td className="p-2 align-top whitespace-pre-wrap w-1/3">{control.controlName}</td>
                                        <td className="p-2 align-top w-48">{control.subDomainName}</td>
                                        <td className="p-1 align-top w-48">
                                            <select value={control.status} onChange={(e) => onUpdateAssessment(control.id, { status: e.target.value as ControlStatus })} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-1 outline-none focus:ring-1 focus:ring-cyan-500">
                                                {controlStatuses.map(s => <option key={s} value={s} className="bg-gray-800">{s}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-1 align-top w-48">
                                            <select value={control.maturity} onChange={(e) => onUpdateAssessment(control.id, { maturity: e.target.value as MaturityRating })} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-1 outline-none focus:ring-1 focus:ring-cyan-500">
                                                {maturityRatings.map(m => <option key={m} value={m} className="bg-gray-800">{m}</option>)}
                                            </select>
                                        </td>
                                        <td className="p-1 align-top w-64">
                                            <div className="relative">
                                                <textarea value={control.recommendation} onChange={(e) => onUpdateAssessment(control.id, { recommendation: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-1 outline-none focus:ring-1 focus:ring-cyan-500 min-h-[50px] resize-y" />
                                                {isSupported && <button type="button" onClick={() => handleDictationClick(control.id, 'recommendation', control.recommendation)} className={`absolute right-1 top-1 p-1 rounded-full hover:bg-white/20 ${isListening && activeDictationTarget?.id === control.id && activeDictationTarget?.field === 'recommendation' ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}><MicrophoneIcon className="h-3 w-3"/></button>}
                                            </div>
                                        </td>
                                        <td className="p-1 align-top w-64">
                                            <div className="relative">
                                                <textarea value={control.managementResponse} onChange={(e) => onUpdateAssessment(control.id, { managementResponse: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-1 outline-none focus:ring-1 focus:ring-cyan-500 min-h-[50px] resize-y" />
                                                {isSupported && <button type="button" onClick={() => handleDictationClick(control.id, 'managementResponse', control.managementResponse)} className={`absolute right-1 top-1 p-1 rounded-full hover:bg-white/20 ${isListening && activeDictationTarget?.id === control.id && activeDictationTarget?.field === 'managementResponse' ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}><MicrophoneIcon className="h-3 w-3"/></button>}
                                            </div>
                                        </td>
                                        <td className="p-1 align-top w-40"><input type="date" value={control.targetDate} onChange={(e) => onUpdateAssessment(control.id, { targetDate: e.target.value })} className="w-full bg-slate-900/50 border border-slate-700 rounded-md p-1 outline-none focus:ring-1 focus:ring-cyan-500" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )) : (
                <div className="text-center p-6 text-gray-400 bg-white/5 rounded-lg">No controls found for your search term.</div>
            )}
        </div>
    );

    return (
        <div className={`p-4 md:p-6 text-white h-full flex flex-col ${isAssistantActive ? 'overflow-hidden' : ''}`}>
            <div className="flex-shrink-0 mb-6">
                <div className="md:flex md:items-start md:justify-between">
                    <div className='flex-grow'>
                        <h1 className="text-3xl lg:text-4xl font-bold text-center md:text-left mb-4 text-cyan-500">NCA ECC Assessment Sheet</h1>
                        <p className="text-center md:text-left text-gray-400 max-w-3xl mx-auto md:mx-0 mb-6">Conduct an interactive assessment of the National Cybersecurity Authority's controls. Use the AI assistant to guide you through each control and record your feedback in real-time.</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0 text-center">
                        <button onClick={onStartAssessment} disabled={isAssistantActive} className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow-md bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed">
                            <MicrophoneIcon /> Start Assessment
                        </button>
                    </div>
                </div>
                 {!isAssistantActive && (
                    <div className="mb-6">
                        <input type="text" placeholder="Search controls by code, name, or domain..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-lg mx-auto block bg-slate-900/50 border border-cyan-500/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
                    </div>
                )}
            </div>
             {isAssistantActive ? (
                <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                    <div className="lg:col-span-2 overflow-y-auto pr-2">
                         {activeControl ? (
                             <div className="space-y-6">
                                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                                    <p className="text-sm text-gray-400">Current Domain</p>
                                    <h2 className="text-xl font-bold text-cyan-200">{activeControl.domainName}</h2>
                                </div>
                                <ECCAssessmentForm 
                                    activeControl={activeControl}
                                    onUpdateField={onUpdateAssessment}
                                    currentFocus={currentFocus}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 rounded-lg bg-white/5 border border-white/10">
                                <p>Waiting for the assistant to select a control...</p>
                            </div>
                        )}
                    </div>
                    <div className="lg:col-span-1 overflow-hidden h-full"><AssistantPanel status={assistantStatus} log={conversationLog} /></div>
                </main>
            ) : (
                <div className="flex-grow overflow-y-auto">{tableView}</div>
            )}
        </div>
    );
};

export default ECCAssessmentView;
