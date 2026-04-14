
import React, { useEffect, useCallback, useState, useRef, useMemo } from 'react';
import { Risk, likelihoods, impacts, riskStatuses, controlEffectivenessOptions, riskCategories, RiskHistoryEntry, ECCControl } from '../types';
import { useHistory } from '../hooks/useHistory';
import { RedoIcon, UndoIcon, MicrophoneIcon } from './icons';
import { ncaEccControls } from '../data/nca-ecc-controls';
import { useSpeechToText } from '../hooks/useSpeechToText';

interface RiskDetailModalProps {
  risk: Risk | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedRisk: Risk) => void;
  allRisks: Risk[];
  currentFocus?: { riskId?: string; field: string } | null;
}

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

const HistoryItem: React.FC<{ entry: RiskHistoryEntry }> = ({ entry }) => (
    <div className="flex flex-col text-sm border-l-2 border-cyan-500/30 pl-4 py-2 relative">
        <div className="absolute -left-[5px] top-3 w-2 h-2 rounded-full bg-cyan-500"></div>
        <span className="text-gray-400 text-xs">{new Date(entry.timestamp).toLocaleString()}</span>
        <span className="font-semibold text-cyan-100 mt-1">{entry.updatedBy || 'Unknown User'}</span>
        <span className="text-gray-300 italic">{entry.changeSummary || 'Details not available'}</span>
    </div>
);

const RiskDetailModal: React.FC<RiskDetailModalProps> = ({ isOpen, risk, onClose, onSave, allRisks, currentFocus }) => {
  const {
    state: editedRisk,
    setState: setEditedRisk,
    setInitialState: setInitialEditedRisk,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useHistory<Risk | null>(null);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [controlSearch, setControlSearch] = useState('');
  
  const [activeDictationField, setActiveDictationField] = useState<keyof Risk | null>(null);
  const baseTextRef = useRef('');

  const handleChange = useCallback((field: keyof Risk, value: any) => {
    setEditedRisk(prev => prev ? { ...prev, [field]: value } : null);
    // Clear validation error when field is modified
    if (formErrors[field]) {
        setFormErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[field];
            return newErrors;
        });
    }
  }, [setEditedRisk, formErrors]);

  const handleTranscript = useCallback((transcript: string) => {
    if (activeDictationField) {
      handleChange(activeDictationField, baseTextRef.current + transcript);
    }
  }, [activeDictationField, handleChange, editedRisk]);

  const handleFinalTranscript = useCallback((transcript: string) => {
    if (activeDictationField) {
      const newText = (baseTextRef.current + transcript.trim() + ' ').trim();
      baseTextRef.current = newText ? newText + ' ' : '';
      handleChange(activeDictationField, newText);
    }
  }, [activeDictationField, handleChange, editedRisk]);

  const { isListening, toggleListening, isSupported } = useSpeechToText({
    onTranscript: handleTranscript,
    onFinalTranscript: handleFinalTranscript,
  });

  useEffect(() => {
    if (risk) {
      setInitialEditedRisk({ ...risk, linkedControls: risk.linkedControls || [] });
      setFormErrors({});
    }
  }, [risk, setInitialEditedRisk]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const validateForm = useCallback((): boolean => {
    if (!editedRisk) return false;
    const errors: Record<string, string> = {};
    
    // Validate Risk ID
    if (!editedRisk.RiskID) {
        errors.RiskID = 'Risk ID is required.';
    } else if (!/^[a-zA-Z0-9-]+$/.test(editedRisk.RiskID)) {
        errors.RiskID = 'Risk ID must be alphanumeric (hyphens are allowed).';
    } else if (allRisks.some(r => r.RiskID === editedRisk.RiskID && r.id !== editedRisk.id)) {
        errors.RiskID = 'Risk ID must be unique.';
    }

    // Validate text fields
    if (!editedRisk.RiskTitle?.trim()) errors.RiskTitle = 'Risk Title is required.';
    if (!editedRisk.Description?.trim()) errors.Description = 'Description is required.';
    if (!editedRisk.MitigatingActions?.trim()) errors.MitigatingActions = 'Mitigating Actions are required.';
    if (!editedRisk.GapDescription?.trim()) errors.GapDescription = 'Gap Description is required.';
    if (!editedRisk.RemediationPlan?.trim()) errors.RemediationPlan = 'Remediation Plan is required.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [allRisks, editedRisk]);

  const handleSave = () => {
    if (editedRisk && validateForm()) {
      onSave(editedRisk);
    }
  };

  const handleDictationClick = (field: keyof Risk) => {
    if (isListening && activeDictationField === field) {
        toggleListening();
    } else {
        if (isListening) { 
            toggleListening();
        }
        setActiveDictationField(field);
        baseTextRef.current = editedRisk?.[field] ? `${editedRisk[field]} ` : '';
        setTimeout(toggleListening, 100);
    }
  };

  useEffect(() => {
    if (!isListening && activeDictationField) {
        setActiveDictationField(null);
    }
  }, [isListening, activeDictationField]);


  const filteredControls = useMemo(() => {
    if (!controlSearch) return [];
    const lowerSearch = controlSearch.toLowerCase();
    return ncaEccControls.filter(c => 
      c.controlCode.toLowerCase().includes(lowerSearch) || 
      c.controlName.toLowerCase().includes(lowerSearch)
    ).slice(0, 5);
  }, [controlSearch]);

  const handleToggleControlLink = (controlCode: string) => {
    if (!editedRisk) return;
    const currentControls = editedRisk.linkedControls || [];
    const newControls = currentControls.includes(controlCode)
      ? currentControls.filter(c => c !== controlCode)
      : [...currentControls, controlCode];
    handleChange('linkedControls', newControls);
  };

  const isFieldFocused = (fieldName: string): boolean => {
    if (!currentFocus || !editedRisk) return false;
    return currentFocus.riskId === editedRisk.id && currentFocus.field === fieldName;
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

  if (!isOpen || !editedRisk) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl shadow-cyan-500/20 text-gray-200 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <header className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-cyan-500">Edit Risk Details</h2>
            <div className="flex items-center gap-2">
                <button onClick={undo} disabled={!canUndo} className="p-1 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon/></button>
                <button onClick={redo} disabled={!canRedo} className="p-1 rounded-md hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon/></button>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition text-2xl leading-none">&times;</button>
            </div>
        </header>

        <main className="p-6 space-y-6 overflow-y-auto flex-grow">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Risk ID">
              <TextInput value={editedRisk.RiskID} onChange={(e) => handleChange('RiskID', e.target.value)} />
              {formErrors.RiskID && <p className="text-xs text-red-400 mt-1">{formErrors.RiskID}</p>}
            </FormField>
            <FormField label="Risk Title">
                <div className="relative">
                    <TextInput value={editedRisk.RiskTitle} onChange={(e) => handleChange('RiskTitle', e.target.value)} />
                    <SpeechButton field="RiskTitle" />
                </div>
                {formErrors.RiskTitle && <p className="text-xs text-red-400 mt-1">{formErrors.RiskTitle}</p>}
            </FormField>
             <FormField label="Risk Type" className="md:col-span-2">
                <Select value={editedRisk.Type} onChange={(e) => handleChange('Type', e.target.value)}>{riskCategories.map(cat => <option key={cat} value={cat} className="bg-gray-800">{cat}</option>)}</Select>
            </FormField>
            <FormField label="Description" className="md:col-span-2">
                <div className="relative">
                    <TextArea value={editedRisk.Description} onChange={(e) => handleChange('Description', e.target.value)} />
                    <SpeechButton field="Description" />
                </div>
                {formErrors.Description && <p className="text-xs text-red-400 mt-1">{formErrors.Description}</p>}
            </FormField>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FormField label="Likelihood">
              <Select value={editedRisk.Likelihood} onChange={(e) => handleChange('Likelihood', e.target.value)} className={isFieldFocused('Likelihood') ? 'field-glow' : ''}><option value="">Select...</option>{likelihoods.map(l => <option key={l.value} value={l.value} className="bg-gray-800">{l.name}</option>)}</Select>
            </FormField>
            <FormField label="Impact">
              <Select value={editedRisk.Impact} onChange={(e) => handleChange('Impact', e.target.value)} className={isFieldFocused('Impact') ? 'field-glow' : ''}><option value="">Select...</option>{impacts.map(i => <option key={i.value} value={i.value} className="bg-gray-800">{i.name}</option>)}</Select>
            </FormField>
            <FormField label="Risk Owner">
                <div className="relative"><TextInput value={editedRisk.RiskOwner} onChange={(e) => handleChange('RiskOwner', e.target.value)} className={isFieldFocused('RiskOwner') ? 'field-glow' : ''} /><SpeechButton field="RiskOwner" /></div>
            </FormField>
            <FormField label="Stakeholders">
                <div className="relative"><TextInput value={editedRisk.Stakeholders || ''} onChange={(e) => handleChange('Stakeholders', e.target.value)} /><SpeechButton field="Stakeholders" /></div>
            </FormField>
            <FormField label="Status">
              <Select value={editedRisk.Status} onChange={(e) => handleChange('Status', e.target.value)} className={isFieldFocused('Status') ? 'field-glow' : ''}>{riskStatuses.map(s => <option key={s} value={s} className="bg-gray-800">{s}</option>)}</Select>
            </FormField>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Mitigating Actions" className="md:col-span-2">
                <div className="relative">
                    <TextArea value={editedRisk.MitigatingActions} onChange={(e) => handleChange('MitigatingActions', e.target.value)} className={isFieldFocused('MitigatingActions') ? 'field-glow' : ''} />
                    <SpeechButton field="MitigatingActions" />
                </div>
                {formErrors.MitigatingActions && <p className="text-xs text-red-400 mt-1">{formErrors.MitigatingActions}</p>}
            </FormField>
             <FormField label="Control Effectiveness">
                <Select value={editedRisk.ControlEffectiveness} onChange={(e) => handleChange('ControlEffectiveness', e.target.value)} className={isFieldFocused('ControlEffectiveness') ? 'field-glow' : ''}>{controlEffectivenessOptions.map(opt => <option key={opt} value={opt} className="bg-gray-800">{opt}</option>)}</Select>
            </FormField>
            <FormField label="RPN Score (FMEA)">
                <TextInput type="number" value={editedRisk.RPN || ''} onChange={(e) => handleChange('RPN', parseInt(e.target.value, 10))} />
            </FormField>
            <FormField label="Gap Description" className="md:col-span-2">
                <div className="relative">
                    <TextArea value={editedRisk.GapDescription} onChange={(e) => handleChange('GapDescription', e.target.value)} className={isFieldFocused('GapDescription') ? 'field-glow' : ''} />
                    <SpeechButton field="GapDescription" />
                </div>
                {formErrors.GapDescription && <p className="text-xs text-red-400 mt-1">{formErrors.GapDescription}</p>}
            </FormField>
            <FormField label="Remediation Plan" className="md:col-span-2">
                <div className="relative">
                    <TextArea value={editedRisk.RemediationPlan} onChange={(e) => handleChange('RemediationPlan', e.target.value)} className={isFieldFocused('RemediationPlan') ? 'field-glow' : ''} />
                    <SpeechButton field="RemediationPlan" />
                </div>
                {formErrors.RemediationPlan && <p className="text-xs text-red-400 mt-1">{formErrors.RemediationPlan}</p>}
            </FormField>
          </section>

          {/* Phase 1: Identification Tools */}
          <section className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-cyan-200 mb-4 flex items-center gap-2">
                <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Phase 1</span>
                Identification (Map Causes)
            </h3>
            
            <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Fishbone (Ishikawa) - Map Potential Causes</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <FormField label="People">
                        <TextInput value={editedRisk.fishbone?.people || ''} onChange={e => handleChange('fishbone', { ...editedRisk.fishbone, people: e.target.value })} />
                    </FormField>
                    <FormField label="Process">
                        <TextInput value={editedRisk.fishbone?.process || ''} onChange={e => handleChange('fishbone', { ...editedRisk.fishbone, process: e.target.value })} />
                    </FormField>
                    <FormField label="Technology">
                        <TextInput value={editedRisk.fishbone?.technology || ''} onChange={e => handleChange('fishbone', { ...editedRisk.fishbone, technology: e.target.value })} />
                    </FormField>
                    <FormField label="Environment">
                        <TextInput value={editedRisk.fishbone?.environment || ''} onChange={e => handleChange('fishbone', { ...editedRisk.fishbone, environment: e.target.value })} />
                    </FormField>
                    <FormField label="Management">
                        <TextInput value={editedRisk.fishbone?.management || ''} onChange={e => handleChange('fishbone', { ...editedRisk.fishbone, management: e.target.value })} />
                    </FormField>
                    <FormField label="Materials">
                        <TextInput value={editedRisk.fishbone?.materials || ''} onChange={e => handleChange('fishbone', { ...editedRisk.fishbone, materials: e.target.value })} />
                    </FormField>
                </div>
            </div>
          </section>

          {/* Phase 2: Analysis & Evaluation */}
          <section className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-purple-200 mb-4 flex items-center gap-2">
                <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Phase 2</span>
                Analysis & Evaluation (Drill Down & Prioritize)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 5 Whys */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">5 Whys - Validate Root Cause</h4>
                    <div className="space-y-2">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className="flex gap-2 items-center">
                                <span className="text-xs text-purple-500 font-bold w-4">{i + 1}.</span>
                                <TextInput 
                                    placeholder={`Why ${i === 0 ? 'did this happen?' : 'did that happen?'}`}
                                    value={editedRisk.fiveWhys?.[i] || ''} 
                                    onChange={e => {
                                        const newWhys = [...(editedRisk.fiveWhys || ['', '', '', '', ''])];
                                        newWhys[i] = e.target.value;
                                        handleChange('fiveWhys', newWhys);
                                    }} 
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prioritization Indicator */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Prioritization (80/20 Pareto)</h4>
                    <div className="p-4 bg-slate-900/50 rounded border border-slate-700 flex flex-col items-center justify-center gap-3">
                        {editedRisk.isVitalFew ? (
                            <>
                                <div className="bg-purple-500/20 text-purple-400 px-4 py-2 rounded-full border border-purple-500/30 font-bold text-sm flex items-center gap-2">
                                    <span className="text-xl">⭐</span> Vital Few (High Priority)
                                </div>
                                <p className="text-[10px] text-gray-500 text-center">This risk is part of the 20% that drives 80% of the impact.</p>
                            </>
                        ) : (
                            <>
                                <div className="bg-slate-800 text-gray-500 px-4 py-2 rounded-full border border-slate-700 font-bold text-sm">
                                    Useful Many
                                </div>
                                <p className="text-[10px] text-gray-500 text-center">Run 80/20 Analysis in the main dashboard to update status.</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
          </section>

          {/* Phase 3: Treatment (Controls Framework) */}
          <section className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-green-200 mb-4 flex items-center gap-2">
                <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Phase 3</span>
                Treatment (Controls Framework - "Fix It")
            </h3>
            <FormField label="Link to NCA Essential Cybersecurity Controls (ECC)">
                <TextInput placeholder="Search by control code or name..." value={controlSearch} onChange={e => setControlSearch(e.target.value)} />
            </FormField>
            <div className="mt-2 max-h-48 overflow-y-auto border border-slate-700 rounded-md bg-slate-900/50">
                {filteredControls.map(control => (
                    <label key={control.id} className="flex items-start gap-3 p-2 hover:bg-slate-800 cursor-pointer border-b border-slate-800 last:border-0">
                        <input 
                            type="checkbox" 
                            className="mt-1"
                            checked={editedRisk.linkedControls?.includes(control.id) || false}
                            onChange={(e) => {
                                const current = editedRisk.linkedControls || [];
                                const updated = e.target.checked 
                                    ? [...current, control.id]
                                    : current.filter(id => id !== control.id);
                                handleChange('linkedControls', updated);
                            }}
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-cyan-400">{control.id}</span>
                            <span className="text-[10px] text-gray-300">{control.name}</span>
                        </div>
                    </label>
                ))}
            </div>
          </section>

          {/* Phase 4: Monitoring & Review */}
          <section className="border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-amber-200 mb-4 flex items-center gap-2">
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs uppercase tracking-wider">Phase 4</span>
                Monitoring & Review (Continuous Audit)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">KPIs / KRIs Tracking</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField label="KRI Metric">
                            <TextInput value={editedRisk.KRI || ''} onChange={e => handleChange('KRI', e.target.value)} />
                        </FormField>
                        <FormField label="Target Value">
                            <TextInput value={editedRisk.kpiTarget || ''} onChange={e => handleChange('kpiTarget', e.target.value)} />
                        </FormField>
                        <FormField label="Lead Trigger (Green)">
                            <TextInput value={editedRisk.LeadTrigger || ''} onChange={e => handleChange('LeadTrigger', e.target.value)} className="border-green-500/50 focus:ring-green-500" />
                        </FormField>
                        <FormField label="Lag Trigger (Orange)">
                            <TextInput value={editedRisk.LagTrigger || ''} onChange={e => handleChange('LagTrigger', e.target.value)} className="border-orange-500/50 focus:ring-orange-500" />
                        </FormField>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Incident Tracking</h4>
                        <button 
                            onClick={() => {
                                const newIncident = { id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], description: '', impact: '', actionTaken: '' };
                                handleChange('incidents', [...(editedRisk.incidents || []), newIncident]);
                            }}
                            className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-500/40 transition"
                        >
                            + Add Incident
                        </button>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {editedRisk.incidents?.map((incident, idx) => (
                            <div key={incident.id} className="p-3 bg-slate-900/50 rounded border border-slate-700 space-y-2">
                                <div className="flex justify-between">
                                    <TextInput type="date" value={incident.date} onChange={e => {
                                        const newIncidents = [...editedRisk.incidents!];
                                        newIncidents[idx].date = e.target.value;
                                        handleChange('incidents', newIncidents);
                                    }} className="w-32 py-1 text-xs" />
                                    <button onClick={() => handleChange('incidents', editedRisk.incidents!.filter(inc => inc.id !== incident.id))} className="text-red-400 hover:text-red-300">&times;</button>
                                </div>
                                <TextInput placeholder="Incident Description" value={incident.description} onChange={e => {
                                    const newIncidents = [...editedRisk.incidents!];
                                    newIncidents[idx].description = e.target.value;
                                    handleChange('incidents', newIncidents);
                                }} className="py-1 text-xs" />
                            </div>
                        ))}
                        {(!editedRisk.incidents || editedRisk.incidents.length === 0) && <p className="text-xs text-gray-500 italic">No incidents tracked for this risk.</p>}
                    </div>
                </div>
            </div>
          </section>

          {/* Audit History Section */}
          <section className="mt-8 border-t border-slate-700 pt-6">
            <h3 className="text-lg font-semibold text-cyan-200 mb-4">Audit Trail</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {editedRisk.history && editedRisk.history.length > 0 ? (
                    editedRisk.history.slice().reverse().map((entry, index) => (
                        <HistoryItem key={index} entry={entry} />
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic">No history available for this risk.</p>
                )}
            </div>
          </section>
        </main>

        <footer className="p-4 border-t border-slate-700 flex justify-end gap-4 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg transition">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition">Save Changes</button>
        </footer>
      </div>
    </div>
  );
};

export default RiskDetailModal;
