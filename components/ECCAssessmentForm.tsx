
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ECCAssessment, ControlStatus, MaturityRating } from '../types';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { MicrophoneIcon } from './icons';

interface ECCAssessmentFormProps {
  activeControl: ECCAssessment;
  onUpdateField: (controlId: string, updates: Partial<ECCAssessment>) => void;
  currentFocus: { riskId?: string; controlId?: string; field: string } | null;
}

const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string; labelClassName?: string }> = ({ label, children, className, labelClassName }) => (
    <div className={className}>
        <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${labelClassName || 'text-cyan-300'}`}>{label}</label>
        {children}
    </div>
);

const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
    <textarea {...props} className={`w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition min-h-[80px] resize-y ${className || ''}`} />
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className, ...props }) => (
    <select {...props} className={`w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition ${className || ''}`}>
        {props.children}
    </select>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
    <input {...props} className={`w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition ${className || ''}`} />
);

const controlStatuses = Object.values(ControlStatus);
const maturityRatings = Object.values(MaturityRating);

const ECCAssessmentForm: React.FC<ECCAssessmentFormProps> = ({ activeControl, onUpdateField, currentFocus }) => {
    
    const [activeDictationField, setActiveDictationField] = useState<keyof ECCAssessment | null>(null);
    const baseTextRef = useRef('');

    const handleChange = (field: keyof ECCAssessment, value: any) => {
        onUpdateField(activeControl.id, { [field]: value });
    };

    const handleTranscript = useCallback((transcript: string) => {
        if (activeDictationField) {
            handleChange(activeDictationField, baseTextRef.current + transcript);
        }
    }, [activeDictationField, activeControl]);

    const handleFinalTranscript = useCallback((transcript: string) => {
        if (activeDictationField) {
            const newText = (baseTextRef.current + transcript.trim() + ' ').trim();
            baseTextRef.current = newText ? newText + ' ' : '';
            handleChange(activeDictationField, newText);
        }
    }, [activeDictationField, activeControl]);

    const { isListening, toggleListening, isSupported } = useSpeechToText({
        onTranscript: handleTranscript,
        onFinalTranscript: handleFinalTranscript,
    });

    useEffect(() => {
        if (!isListening && activeDictationField) {
            setActiveDictationField(null);
        }
    }, [isListening]);

    const handleDictationClick = (field: keyof ECCAssessment) => {
        if (isListening && activeDictationField === field) {
            toggleListening();
        } else {
            if (isListening) {
                toggleListening();
            }
            setActiveDictationField(field);
            baseTextRef.current = activeControl?.[field] ? `${activeControl[field]} ` : '';
            setTimeout(toggleListening, 100);
        }
    };

    const isFieldFocused = (fieldName: string): boolean => {
        if (!currentFocus || !activeControl) return false;
        return currentFocus.controlId === activeControl.id && currentFocus.field === fieldName;
    };

    const isControlNameFocused = isFieldFocused('controlName');

    const SpeechButton: React.FC<{field: keyof ECCAssessment}> = ({field}) => {
        if (!isSupported) return null;
        return (
            <button 
                type="button" 
                onClick={() => handleDictationClick(field)}
                title="Dictate text"
                className={`absolute right-2 top-2 p-1 rounded-full hover:bg-white/20 transition-colors ${isListening && activeDictationField === field ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}
            >
                <MicrophoneIcon className="h-4 w-4"/>
            </button>
        )
    };

    return (
        <div className="p-6 bg-white/5 rounded-lg border border-white/10 space-y-6 overflow-y-auto h-full">
            <div className={`transition-all duration-300 p-3 rounded-lg border ${isControlNameFocused ? 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-transparent'}`}>
                <h3 className={`text-lg font-semibold transition-colors ${isControlNameFocused ? 'text-cyan-100' : 'text-cyan-200'}`}>{activeControl.controlCode}: {activeControl.controlName}</h3>
                <p className="text-sm text-gray-400">{activeControl.domainName} &gt; {activeControl.subDomainName}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Status" labelClassName={isFieldFocused('status') ? 'text-cyan-200 animate-pulse' : ''}>
                    <Select value={activeControl.status} onChange={(e) => handleChange('status', e.target.value as ControlStatus)} className={isFieldFocused('status') ? 'field-glow' : ''}>
                        {controlStatuses.map(s => <option key={s} value={s} className="bg-gray-800">{s}</option>)}
                    </Select>
                </FormField>
                <FormField label="Maturity Rating" labelClassName={isFieldFocused('maturity') ? 'text-cyan-200 animate-pulse' : ''}>
                     <Select value={activeControl.maturity} onChange={(e) => handleChange('maturity', e.target.value as MaturityRating)} className={isFieldFocused('maturity') ? 'field-glow' : ''}>
                        {maturityRatings.map(m => <option key={m} value={m} className="bg-gray-800">{m}</option>)}
                    </Select>
                </FormField>
                <FormField label="Target Date" className="md:col-start-1" labelClassName={isFieldFocused('targetDate') ? 'text-cyan-200 animate-pulse' : ''}>
                    <Input type="date" value={activeControl.targetDate} onChange={(e) => handleChange('targetDate', e.target.value)} className={isFieldFocused('targetDate') ? 'field-glow' : ''} />
                </FormField>
                <div className="md:col-span-2 space-y-6">
                    <FormField label="Recommendation" labelClassName={isFieldFocused('recommendation') ? 'text-cyan-200 animate-pulse' : ''}>
                        <div className="relative">
                            <TextArea value={activeControl.recommendation} onChange={(e) => handleChange('recommendation', e.target.value)} className={isFieldFocused('recommendation') ? 'field-glow' : ''} rows={4} />
                            <SpeechButton field="recommendation" />
                        </div>
                    </FormField>
                    <FormField label="Management Response" labelClassName={isFieldFocused('managementResponse') ? 'text-cyan-200 animate-pulse' : ''}>
                        <div className="relative">
                            <TextArea value={activeControl.managementResponse} onChange={(e) => handleChange('managementResponse', e.target.value)} className={isFieldFocused('managementResponse') ? 'field-glow' : ''} rows={4} />
                            <SpeechButton field="managementResponse" />
                        </div>
                    </FormField>
                </div>
            </div>
        </div>
    );
};

export default ECCAssessmentForm;
