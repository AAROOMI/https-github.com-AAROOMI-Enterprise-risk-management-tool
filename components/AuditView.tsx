
import React, { useState, useMemo } from 'react';
import { Risk, ECCAssessment, RiskLevel } from '../types';
import { GoogleGenAI } from '@google/genai';
import { AuditIcon, MicrophoneIcon } from './icons';

interface AuditViewProps {
  risks: Risk[];
  eccAssessments: ECCAssessment[];
  onStartAudit: () => void;
  isAssistantActive: boolean;
}

const StatCard: React.FC<{ title: string; value: number | string; color: string; description: string }> = ({ title, value, color, description }) => (
  <div className="bg-white/5 p-6 rounded-lg border border-white/10 flex flex-col justify-between">
    <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
    </div>
    <p className="text-xs text-gray-500 mt-2">{description}</p>
  </div>
);

const AuditView: React.FC<AuditViewProps> = ({ risks, eccAssessments, onStartAudit, isAssistantActive }) => {
    const [auditSummary, setAuditSummary] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const stats = useMemo(() => {
        const highOpen = risks.filter(r => r.RiskLevel === RiskLevel.High && r.Status === 'Open').length;
        const ineffective = risks.filter(r => r.ControlEffectiveness === 'Ineffective').length;
        const unassessed = eccAssessments.filter(c => c.status === 'Not Assessed').length;
        const overdue = eccAssessments.filter(c => c.targetDate && new Date(c.targetDate) < new Date()).length;
        return { highOpen, ineffective, unassessed, overdue };
    }, [risks, eccAssessments]);

    const handleGenerateSummary = async () => {
        setIsLoading(true);
        setError('');
        setAuditSummary('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                You are a Lead GRC (Governance, Risk, and Compliance) Auditor.
                Perform a comprehensive audit analysis on the following data.
                
                Data Context:
                - Risks: ${JSON.stringify(risks.map(r => ({id: r.RiskID, title: r.RiskTitle, level: r.RiskLevel, status: r.Status, control: r.ControlEffectiveness})), null, 2)}
                - Controls: ${JSON.stringify(eccAssessments.filter(c => c.status !== 'Not Assessed').map(c => ({code: c.controlCode, status: c.status})), null, 2)}

                Produce a formal "Professional Audit Report" in Markdown format with the following sections:
                
                1. **Executive Audit Opinion**: A definitive statement on the organization's compliance posture (e.g., "Satisfactory", "Needs Improvement", "Critical Failure").
                2. **Critical Findings**: Identify specific high-level risks or ineffective controls that pose an immediate threat. Cite Risk IDs.
                3. **Evidence Gaps**: Highlight areas where controls are marked 'Effective' but might lack sufficient evidence (based on typical audit patterns).
                4. **Strategic Recommendations**: Prioritized actions to remediation the findings.
                
                Tone: Professional, Objective, Authoritative.
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: prompt,
            });
            setAuditSummary(response.text);
        } catch (err) {
            console.error(err);
            setError('An error occurred while generating the audit summary. Please check your API key and try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // A simple markdown-to-HTML renderer
    const renderMarkdown = (text: string) => {
        if (!text) return '';
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^(#+)\s*(.*)/gm, (_, hashes, content) => `<h${hashes.length + 1} class="text-xl font-bold mt-4 mb-2 text-cyan-300">${content}</h${hashes.length + 1}>`)
            .replace(/^- (.*)/gm, '<li class="ml-6">$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc pl-5 mb-4">$1</ul>')
            .replace(/\n/g, '<br />');
    };

    return (
        <div className="p-4 md:p-6 text-white h-full overflow-y-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-cyan-500">Compliance & Risk Audit</h1>
            <p className="text-center text-gray-400 max-w-3xl mx-auto mb-10">
                Perform due diligence and gather evidence with the AI Auditor.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard title="Open High-Level Risks" value={stats.highOpen} color={stats.highOpen > 0 ? 'text-red-400' : 'text-green-400'} description="Risks that are both 'High' and have a status of 'Open'." />
                <StatCard title="Ineffective Controls" value={stats.ineffective} color={stats.ineffective > 0 ? 'text-red-400' : 'text-green-400'} description="Risks where the mitigating controls are marked as 'Ineffective'." />
                <StatCard title="Unassessed ECC Controls" value={stats.unassessed} color={stats.unassessed > 0 ? 'text-yellow-400' : 'text-green-400'} description="NCA ECC controls that have not yet been assessed." />
                <StatCard title="Overdue Remediation" value={stats.overdue} color={stats.overdue > 0 ? 'text-yellow-400' : 'text-green-400'} description="ECC controls with a target date in the past." />
            </div>

            <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-cyan-300">Audit Actions</h2>
                        <p className="text-gray-400 text-sm">Choose an audit method below.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={onStartAudit}
                            disabled={isAssistantActive}
                            className="flex items-center gap-2 px-6 py-3 border font-semibold rounded-lg shadow-md bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/40 text-purple-300 hover:shadow-purple-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <MicrophoneIcon />
                            Start Interactive Due Diligence
                        </button>
                        <button
                            onClick={handleGenerateSummary}
                            disabled={isLoading}
                            className="flex items-center gap-2 px-6 py-3 border font-semibold rounded-lg shadow-md bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-wait"
                        >
                            <AuditIcon />
                            {isLoading ? 'Generating Report...' : 'Generate Audit Report'}
                        </button>
                    </div>
                </div>
                
                {error && <div className="p-4 bg-red-500/20 text-red-200 border border-red-500/50 rounded-md">{error}</div>}
                
                {auditSummary ? (
                    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Professional Audit Report</h3>
                        <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: renderMarkdown(auditSummary) }} />
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-400 border-t border-white/5 mt-4">
                        <p>Generate a report to see the AI Auditor's findings and recommendations.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditView;
