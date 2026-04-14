import React, { useMemo } from 'react';
import { Risk, RiskLevel, likelihoods, impacts } from '../types';
import { ncaEccControls } from '../data/nca-ecc-controls';
import { LogoIcon } from './icons';

interface ReportViewProps {
  risks: Risk[];
  companyName: string;
  assessorName: string;
  logoSrc: string | null;
}

// --- Report Layout Components ---

const PageBreak: React.FC = () => <div className="page-break-after"></div>;

const ReportHeader: React.FC<{ text: string }> = ({ text }) => (
    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-cyan-500 pb-2 mb-6">{text}</h2>
);

const ReportSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="mb-8">
        <ReportHeader text={title} />
        {children}
    </section>
);

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className="border border-gray-200 rounded-lg p-4 text-center shadow-sm">
    <p className="text-gray-600 text-sm font-medium">{title}</p>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);


const RiskLevelBadge: React.FC<{ level: RiskLevel; isPrint?: boolean }> = ({ level, isPrint = true }) => {
  const baseStyles = `px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap`;
  const levelStyles = {
    [RiskLevel.High]: isPrint ? 'bg-red-500 text-white' : 'bg-red-200 text-red-800',
    [RiskLevel.Medium]: isPrint ? 'bg-yellow-400 text-white' : 'bg-yellow-200 text-yellow-800',
    [RiskLevel.Low]: isPrint ? 'bg-cyan-500 text-white' : 'bg-cyan-200 text-cyan-800',
  };
  return <span className={`${baseStyles} ${levelStyles[level]}`}>{level}</span>;
};

// --- Report Content Sections ---

const CoverPage: React.FC<Pick<ReportViewProps, 'logoSrc' | 'companyName' | 'assessorName'>> = ({ logoSrc, companyName, assessorName }) => (
    <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-32 h-32 mb-8">
            {logoSrc ? (
                <img src={logoSrc} alt="Company Logo" className="h-full w-full object-contain" />
            ) : (
                <LogoIcon className="h-full w-full text-cyan-500" />
            )}
        </div>
        <h1 className="text-4xl font-bold text-gray-800">Risk Assessment & Gap Analysis Report</h1>
        <p className="text-2xl text-gray-600 mt-4">{companyName || 'Your Company Name'}</p>
        <div className="mt-16 text-lg text-gray-700 space-y-2">
            <p><strong>Assessor:</strong> {assessorName || 'Not Specified'}</p>
            <p><strong>Date of Generation:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        <div className="absolute bottom-12 text-center text-sm text-gray-500">
            <p>CONFIDENTIAL</p>
            <p>&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
        </div>
    </div>
);

const ExecutiveSummary: React.FC<{ risks: Risk[] }> = ({ risks }) => {
    const stats = useMemo(() => {
        return risks.reduce(
            (acc, risk) => {
                acc.total++;
                if (risk.RiskLevel === RiskLevel.High) acc.high++;
                const needsAttention = (risk.GapDescription && risk.GapDescription.trim() !== '') ||
                    (risk.RemediationPlan && risk.RemediationPlan.trim() !== '') ||
                    risk.ControlEffectiveness === 'Ineffective';
                if (needsAttention) acc.attention++;
                return acc;
            }, { total: 0, high: 0, attention: 0 }
        );
    }, [risks]);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Risks Identified" value={stats.total} color="text-cyan-500" />
                <StatCard title="High-Level Risks" value={stats.high} color="text-red-500" />
                <StatCard title="Risks Requiring Attention" value={stats.attention} color="text-yellow-500" />
            </div>
            <div className="prose max-w-none text-gray-700">
                <p>This report provides a comprehensive overview of the risk assessment and gap analysis conducted for the organization. The assessment identifies, evaluates, and prioritizes risks to organizational operations, assets, and individuals. The following sections detail the methodology used, the complete risk register, a focused analysis of identified gaps, and linkages to the NCA Essential Cybersecurity Controls framework.</p>
                <p><strong>Key Findings (Placeholder):</strong> <i>[User should summarize the most critical risks, key areas of weakness (e.g., ineffective controls in a specific domain), and high-level trends observed during the assessment. For example: "The assessment identified a significant concentration of high-level risks within the Third-Party Vendor Management category, primarily due to a lack of formal review processes..."]</i></p>
            </div>
        </>
    );
};

const RiskMethodology: React.FC = () => (
    <div className="prose max-w-none text-gray-700">
        <p>The risk assessment methodology is based on a 5x5 matrix, evaluating risks based on their Likelihood and Impact. Each factor is rated on a scale from 1 (low) to 5 (high). The product of these two scores determines the overall Risk Level.</p>
        <ul>
            <li><strong>High (Score 15-25):</strong> Requires immediate attention and a defined mitigation plan.</li>
            <li><strong>Medium (Score 5-14):</strong> Requires attention and monitoring. Mitigation should be planned.</li>
            <li><strong>Low (Score 1-4):</strong> Generally acceptable, requires minimal monitoring.</li>
        </ul>
        <p>This systematic approach ensures that resources are prioritized to address the most significant threats to the organization first.</p>
    </div>
);

const ReportTable: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100">
                <tr>
                    {headers.map(h => <th key={h} className="p-2 border border-gray-300 font-semibold text-left text-gray-700">{h}</th>)}
                </tr>
            </thead>
            <tbody>
                {children}
            </tbody>
        </table>
    </div>
);

// --- Main Report View Component ---

export const ReportView: React.FC<ReportViewProps> = ({ risks, companyName, assessorName, logoSrc }) => {
    const gapRisks = useMemo(() => risks.filter(r => 
        (r.GapDescription && r.GapDescription.trim() !== '') ||
        (r.RemediationPlan && r.RemediationPlan.trim() !== '') ||
        ['Ineffective', 'Partially Effective'].includes(r.ControlEffectiveness || '')
    ), [risks]);

    const risksWithControls = useMemo(() => risks.filter(r => r.linkedControls && r.linkedControls.length > 0), [risks]);
    
    return (
        <div className="report-container bg-white text-black p-4 print:p-0">
            {/* Page Wrapper for consistent footers */}
            <div className="page">
                <CoverPage logoSrc={logoSrc} companyName={companyName} assessorName={assessorName} />
            </div>

            <PageBreak />
            
            <div className="page">
                <ReportSection title="Executive Summary">
                    <ExecutiveSummary risks={risks} />
                </ReportSection>
                <ReportSection title="Risk Assessment Methodology">
                    <RiskMethodology />
                </ReportSection>
            </div>
            
            <PageBreak />

            <div className="page">
                <ReportSection title="Full Risk Register">
                    <ReportTable headers={["ID", "Title", "Likelihood", "Impact", "Level", "Owner", "Status"]}>
                        {risks.map(risk => (
                            <tr key={risk.id} className="even:bg-gray-50">
                                <td className="p-2 border border-gray-300 align-top">{risk.RiskID}</td>
                                <td className="p-2 border border-gray-300 align-top">{risk.RiskTitle}</td>
                                <td className="p-2 border border-gray-300 align-top">{likelihoods.find(l => l.value === risk.Likelihood)?.name || risk.Likelihood}</td>
                                <td className="p-2 border border-gray-300 align-top">{impacts.find(i => i.value === risk.Impact)?.name || risk.Impact}</td>
                                <td className="p-2 border border-gray-300 align-middle text-center"><RiskLevelBadge level={risk.RiskLevel} /></td>
                                <td className="p-2 border border-gray-300 align-top">{risk.RiskOwner}</td>
                                <td className="p-2 border border-gray-300 align-top">{risk.Status}</td>
                            </tr>
                        ))}
                    </ReportTable>
                </ReportSection>
            </div>
            
            <PageBreak />

            <div className="page">
                 <ReportSection title="Gap Assessment Summary">
                    <ReportTable headers={["ID", "Title", "Control Effectiveness", "Gap Description", "Remediation Plan"]}>
                        {gapRisks.map(risk => (
                            <tr key={risk.id} className="even:bg-gray-50">
                                <td className="p-2 border border-gray-300 align-top">{risk.RiskID}</td>
                                <td className="p-2 border border-gray-300 align-top">{risk.RiskTitle}</td>
                                <td className="p-2 border border-gray-300 align-top">{risk.ControlEffectiveness}</td>
                                <td className="p-2 border border-gray-300 align-top whitespace-pre-wrap">{risk.GapDescription}</td>
                                <td className="p-2 border border-gray-300 align-top whitespace-pre-wrap">{risk.RemediationPlan}</td>
                            </tr>
                        ))}
                    </ReportTable>
                </ReportSection>
            </div>
            
            <PageBreak />
            
            <div className="page">
                <ReportSection title="NCA ECC Control Linkage">
                    {risksWithControls.length > 0 ? (
                        <ReportTable headers={["Risk ID", "Risk Title", "Linked ECC Control(s)"]}>
                            {risksWithControls.map(risk => (
                                <tr key={risk.id} className="even:bg-gray-50">
                                    <td className="p-2 border border-gray-300 align-top">{risk.RiskID}</td>
                                    <td className="p-2 border border-gray-300 align-top">{risk.RiskTitle}</td>
                                    <td className="p-2 border border-gray-300 align-top">
                                        <ul className="list-disc list-inside">
                                            {risk.linkedControls?.map(code => {
                                                const control = ncaEccControls.find(c => c.controlCode === code);
                                                return <li key={code}><strong>{code}:</strong> {control?.controlName || 'Unknown Control'}</li>
                                            })}
                                        </ul>
                                    </td>
                                </tr>
                            ))}
                        </ReportTable>
                    ) : (
                        <p className="text-gray-600">No risks are currently linked to NCA ECC controls.</p>
                    )}
                </ReportSection>
            </div>
        </div>
    );
};