
import React, { useRef } from 'react';
import { AddIcon, ExportIcon, ImportIcon, PrintIcon, PolicyIcon, MicrophoneIcon, MicrophoneOffIcon, UndoIcon, RedoIcon, DeployIcon, ResetIcon } from './icons';

interface ControlsProps {
  onAddRow: () => void;
  onExportCsv: () => void;
  onImportCsv: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPrint: () => void;
  onGeneratePolicy: () => void;
  isAssistantActive: boolean;
  onToggleAssistant: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDeployWithAI: () => void;
  onResetData: () => void;
  onParetoAnalysis: () => void;
  onGeneratePRA: () => void;
  onGenerateFMEA: () => void;
  onGenerateFTA: () => void;
}

const ControlButton: React.FC<{ onClick?: () => void, children: React.ReactNode, isActive?: boolean, className?: string, disabled?: boolean, title?: string }> = ({ onClick, children, isActive = false, className = '', disabled = false, title }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-semibold rounded-lg shadow-md hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 ${
            isActive
                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
        {children}
    </button>
);

const Controls: React.FC<ControlsProps> = ({ 
    onAddRow, onExportCsv, onImportCsv, onPrint, onGeneratePolicy, isAssistantActive, onToggleAssistant,
    onUndo, onRedo, canUndo, canRedo, onDeployWithAI, onResetData, onParetoAnalysis,
    onGeneratePRA, onGenerateFMEA, onGenerateFTA
}) => {
    const importInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        importInputRef.current?.click();
    };
  
    return (
        <div className="p-4 flex flex-col gap-4 print:hidden border-b border-slate-700 bg-slate-900/30">
            <div className="flex flex-wrap items-center justify-center gap-4">
                {/* Phase 1: Identification (What can fail?) */}
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex flex-col mr-2">
                        <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Phase 1</span>
                        <span className="text-[8px] text-gray-500 uppercase">Identification</span>
                    </div>
                    <ControlButton onClick={onAddRow} title="Manual Identification"><AddIcon /> Add Risk</ControlButton>
                    <ControlButton onClick={onGenerateFMEA} title="FMEA (Bottom-up): What can fail?"><DeployIcon className="w-4 h-4 text-yellow-400"/> FMEA</ControlButton>
                </div>

                {/* Phase 2: Analysis & Evaluation (Why & How much?) */}
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex flex-col mr-2">
                        <span className="text-[10px] font-bold text-purple-500 uppercase tracking-widest">Phase 2</span>
                        <span className="text-[8px] text-gray-500 uppercase">Analysis</span>
                    </div>
                    <ControlButton onClick={onGenerateFTA} title="FTA (Top-down): Why did failure happen?"><DeployIcon className="w-4 h-4 text-red-400"/> FTA</ControlButton>
                    <ControlButton onClick={onGeneratePRA} title="PRA (Quantitative): How likely & severe?"><DeployIcon className="w-4 h-4 text-green-400"/> PRA</ControlButton>
                    <ControlButton onClick={onParetoAnalysis} title="80/20 Pareto: Focus Effort" className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                        📊 80/20 Pareto
                    </ControlButton>
                </div>

                {/* AI Assistant */}
                <ControlButton onClick={onToggleAssistant} className={isAssistantActive ? 'bg-red-500/20 border-red-500/40 text-red-300 hover:bg-red-500/30' : ''}>
                    {isAssistantActive ? <MicrophoneOffIcon /> : <MicrophoneIcon />}
                    {isAssistantActive ? 'Stop Assistant' : 'AI Assistant'}
                </ControlButton>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
                <ControlButton onClick={onUndo} disabled={!canUndo}><UndoIcon /> Undo</ControlButton>
                <ControlButton onClick={onRedo} disabled={!canRedo}><RedoIcon /> Redo</ControlButton>
                <div className="h-6 w-px bg-cyan-500/20"></div>
                <ControlButton onClick={onExportCsv}><ExportIcon /> Export</ControlButton>
                <ControlButton onClick={handleImportClick}><ImportIcon /> Import</ControlButton>
                <ControlButton onClick={onDeployWithAI}><DeployIcon /> Deploy</ControlButton>
                <ControlButton onClick={onGeneratePolicy}><PolicyIcon /> Policy</ControlButton>
                <ControlButton onClick={onPrint}><PrintIcon /> Print</ControlButton>
                <ControlButton onClick={onResetData} className="bg-red-500/10 border-red-500/30 text-red-300 hover:bg-red-500/20"><ResetIcon /> Reset</ControlButton>
                <input type="file" ref={importInputRef} onChange={onImportCsv} accept=".csv" className="hidden" />
            </div>
        </div>
    );
};

export default Controls;
