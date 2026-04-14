
import React, { useMemo } from 'react';
import { Risk, RiskLevel, calculateRiskMetrics, controlEffectivenessOptions, ECCAssessment, ControlStatus } from '../types';

interface DashboardProps {
  risks: Risk[];
  eccAssessments: ECCAssessment[];
}

const StatCard: React.FC<{ title: string; value: number | string; color: string }> = ({ title, value, color }) => (
  <div className="bg-white/5 p-6 rounded-lg border border-white/10 flex flex-col justify-between">
    <p className="text-gray-400 text-sm font-medium">{title}</p>
    <p className={`text-4xl font-bold ${color}`}>{value}</p>
  </div>
);

const ChartContainer: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white/5 p-4 rounded-lg border border-white/10 ${className}`}>
    <h3 className="font-semibold text-lg text-cyan-200 mb-4 px-2">{title}</h3>
    <div className="h-full">{children}</div>
  </div>
);

const RiskLevelPieChart: React.FC<{ data: { high: number; medium: number; low: number } }> = ({ data }) => {
    const total = data.high + data.medium + data.low;
    if (total === 0) return <div className="flex items-center justify-center h-64 text-gray-400">No data available</div>;

    const percentages = { high: (data.high / total) * 100, medium: (data.medium / total) * 100, low: (data.low / total) * 100 };
    const strokeWidth = 12; const radius = 50; const circumference = 2 * Math.PI * radius;
    const highOffset = 0; const mediumOffset = (percentages.high / 100) * circumference; const lowOffset = ((percentages.high + percentages.medium) / 100) * circumference;
    const segments = [
        { percentage: percentages.high, color: 'stroke-red-400', offset: highOffset, label: 'High', value: data.high },
        { percentage: percentages.medium, color: 'stroke-yellow-400', offset: mediumOffset, label: 'Medium', value: data.medium },
        { percentage: percentages.low, color: 'stroke-cyan-500', offset: lowOffset, label: 'Low', value: data.low },
    ];

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-4 h-full">
            <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
                    {segments.map((seg, i) => seg.percentage > 0 && (
                        <circle key={i} cx="60" cy="60" r={radius} fill="none" className={seg.color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={circumference - (seg.percentage / 100) * circumference} style={{ transform: `rotate(${(seg.offset / circumference) * 360}deg)`, transformOrigin: '50% 50%' }} />
                    ))}
                </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{total}</span>
                    <span className="text-sm text-gray-400">Total Risks</span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {segments.map((seg, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${seg.label === 'Low' ? 'bg-cyan-500' : seg.color.replace('stroke-', 'bg-')}`}></div>
                        <span className="text-gray-300">{seg.label}</span>
                        <span className="font-semibold text-white">{seg.value}</span>
                        <span className="text-gray-400 text-sm">({seg.percentage.toFixed(1)}%)</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RiskHeatmap: React.FC<{ risks: Risk[] }> = ({ risks }) => {
    const { matrix, maxCount } = useMemo(() => {
        const matrix: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0));
        let maxCount = 1;
        risks.forEach(risk => {
            const impact = parseInt(risk.Impact, 10);
            const likelihood = parseInt(risk.Likelihood, 10);
            if (!isNaN(impact) && !isNaN(likelihood) && impact >= 1 && impact <= 5 && likelihood >= 1 && likelihood <= 5) {
                matrix[5-likelihood][impact-1] = matrix[5-likelihood][impact-1] + 1;
                const count = matrix[5-likelihood][impact-1];
                if (count > maxCount) maxCount = count;
            }
        });
        return { matrix, maxCount };
    }, [risks]);

    const getCellColor = (count: number, likelihoodValue: number, impactValue: number) => {
        const { riskLevel } = calculateRiskMetrics(String(likelihoodValue), String(impactValue));
        const baseColors = { [RiskLevel.High]: 'rgba(239, 68, 68, 1)', [RiskLevel.Medium]: 'rgba(234, 179, 8, 1)', [RiskLevel.Low]: 'rgba(6, 182, 212, 1)' };
        if (count === 0) return baseColors[riskLevel]?.replace('1)', '0.1)');
        const opacity = Math.min(0.3 + (count / maxCount) * 0.7, 1);
        return baseColors[riskLevel]?.replace('1)', `${opacity})`);
    };

    const impactLabels = ['1', '2', '3', '4', '5']; const likelihoodLabels = ['5', '4', '3', '2', '1'];

    return (
        <div className="flex items-center justify-center p-2 h-full">
            <div className="grid grid-cols-6 gap-1 text-center text-xs text-gray-400 w-full max-w-sm">
                <div className="flex items-end justify-center"><span className="-rotate-90 origin-center translate-y-8">Likelihood</span></div>
                {impactLabels.map(label => <div key={label} className="font-semibold">{label}</div>)}
                {matrix.map((row, rowIndex) => (
                    <React.Fragment key={rowIndex}>
                        <div className="font-semibold">{likelihoodLabels[rowIndex]}</div>
                        {row.map((count, colIndex) => (
                             <div key={colIndex} className="relative group w-full aspect-square rounded flex items-center justify-center font-bold text-white text-lg transition-colors" style={{ backgroundColor: getCellColor(count, 5 - rowIndex, 1 + colIndex) }}>
                                 {count > 0 ? count : ''}
                                 <div className="absolute bottom-full mb-2 w-max px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg border border-slate-700 z-10 text-left">
                                     Likelihood: {5 - rowIndex}<br/>
                                     Impact: {1 + colIndex}<br/>
                                     <span className="font-bold">{count} risk(s)</span>
                                     <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
                                 </div>
                             </div>
                        ))}
                    </React.Fragment>
                ))}
                <div></div><div className="col-span-5 pt-1 font-semibold">Impact</div>
            </div>
        </div>
    );
};

const TopRiskOwnersChart: React.FC<{risks: Risk[]}> = ({risks}) => {
    const ownerData = useMemo(() => {
        const counts = risks.reduce((acc: Record<string, number>, risk) => {
            const owner = risk.RiskOwner || 'Unassigned';
            acc[owner] = (acc[owner] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        // Ensure values are treated as numbers for arithmetic operations
        return Object.entries(counts).sort(([, a], [, b]) => (b as number) - (a as number)).slice(0, 5);
    }, [risks]);

    if (ownerData.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No risk owners assigned</div>;
    const maxCount = Math.max(...ownerData.map(([, count]) => count), 0);
    return (
        <div className="space-y-3 px-2">
            {ownerData.map(([owner, count]) => (
                <div key={owner} className="grid grid-cols-3 gap-2 items-center text-sm">
                    <div className="truncate text-gray-300" title={owner}>{owner}</div>
                    <div className="col-span-2 bg-white/10 rounded-full"><div className="bg-cyan-500 h-6 flex items-center justify-end px-2 rounded-full text-white font-semibold" style={{ width: `${(count / maxCount) * 100}%`}}>{count}</div></div>
                </div>
            ))}
        </div>
    );
}

const RiskStatusChart: React.FC<{risks: Risk[]}> = ({risks}) => {
    const statusData = useMemo(() => {
        const counts = risks.reduce((acc: Record<string, number>, risk) => { acc[risk.Status || 'Unknown'] = (acc[risk.Status || 'Unknown'] || 0) + 1; return acc; }, {} as Record<string, number>);
        // Ensure values are treated as numbers for arithmetic operations
        return Object.entries(counts).sort(([, a], [, b]) => (b as number) - (a as number));
    }, [risks]);
    if (statusData.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No status data available</div>;
    const maxCount = Math.max(...statusData.map(([, count]) => count), 0);
    return (
        <div className="flex justify-around items-end h-64 gap-4 px-4 pb-4">
            {statusData.map(([status, count]) => (
                <div key={status} className="flex flex-col items-center flex-1">
                    <div className="text-white font-bold">{count}</div>
                    <div className="w-full bg-white/10 rounded-t-md flex-grow flex items-end"><div className="w-full bg-cyan-500 rounded-t-md" style={{ height: `${(count / maxCount) * 100}%` }} title={`${status}: ${count}`}></div></div>
                    <div className="text-xs text-gray-400 mt-1 truncate w-full text-center" title={status}>{status}</div>
                </div>
            ))}
        </div>
    )
}

const ControlEffectivenessChart: React.FC<{risks: Risk[]}> = ({risks}) => {
    const effectivenessData = useMemo(() => {
        const counts = controlEffectivenessOptions.reduce((acc, option) => ({ ...acc, [option]: 0 }), {} as Record<string, number>);
        risks.forEach(risk => { if(counts.hasOwnProperty(risk.ControlEffectiveness || 'Not Assessed')) counts[risk.ControlEffectiveness || 'Not Assessed']++; });
        return Object.entries(counts).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1]);
    }, [risks]);

    if (effectivenessData.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No control data available</div>;
    const maxCount = Math.max(...effectivenessData.map(([, count]) => count), 0);
    const colors: { [key: string]: string } = { "Effective": "bg-cyan-500", "Partially Effective": "bg-yellow-500", "Ineffective": "bg-red-500", "Not Implemented": "bg-gray-500", "Not Assessed": "bg-cyan-500" };
    return (
        <div className="space-y-3 px-2">
            {effectivenessData.map(([effectiveness, count]) => (
                <div key={effectiveness} className="grid grid-cols-3 gap-2 items-center text-sm">
                    <div className="truncate text-gray-300" title={effectiveness}>{effectiveness}</div>
                    <div className="col-span-2 bg-white/10 rounded-full"><div className={`h-6 flex items-center justify-end px-2 rounded-full text-white font-semibold ${colors[effectiveness] || 'bg-cyan-500'}`} style={{ width: `${(count / maxCount) * 100}%`}}>{count}</div></div>
                </div>
            ))}
        </div>
    );
}

const ControlStatusChart: React.FC<{assessments: ECCAssessment[]}> = ({assessments}) => {
    const statusData = useMemo(() => {
        const counts = Object.values(ControlStatus).reduce((acc, status) => ({...acc, [status]: 0}), {} as Record<string, number>);
        assessments.forEach(assessment => { if(counts.hasOwnProperty(assessment.status)) counts[assessment.status]++; });
        return Object.entries(counts).filter(([, count]) => count > 0).sort((a, b) => b[1] - a[1]);
    }, [assessments]);

    if(statusData.length === 0) return <div className="flex items-center justify-center h-full text-gray-400">No assessment data available</div>;

    const total = assessments.length;
    const colors: { [key: string]: string } = {
        [ControlStatus.Implemented]: 'bg-cyan-500',
        [ControlStatus.PartiallyImplemented]: 'bg-yellow-500',
        [ControlStatus.NotImplemented]: 'bg-red-500',
        [ControlStatus.NotApplicable]: 'bg-gray-500',
        [ControlStatus.NotAssessed]: 'bg-cyan-500',
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex rounded-full bg-white/10 h-6 w-full overflow-hidden">
                {statusData.map(([status, count]) => (
                    <div 
                        key={status}
                        className={`${colors[status]} transition-all duration-500`}
                        style={{ width: `${(count/total) * 100}%`}}
                        title={`${status}: ${count} (${((count/total)*100).toFixed(1)}%)`}
                    />
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
                {statusData.map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${colors[status]}`}></div>
                        <span className="text-gray-300">{status}</span>
                        <span className="font-semibold text-white">{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}


const Dashboard: React.FC<DashboardProps> = ({ risks, eccAssessments }) => {
  const { stats, attentionRisks, totalIncidents, krisAtRisk } = useMemo(() => {
    const calculatedStats = risks.reduce((acc, risk) => {
        acc.total++;
        if (risk.RiskLevel === RiskLevel.High) acc.high++;
        else if (risk.RiskLevel === RiskLevel.Medium) acc.medium++;
        else if (risk.RiskLevel === RiskLevel.Low) acc.low++;
        return acc;
    }, { total: 0, high: 0, medium: 0, low: 0 });
    
    const calculatedAttentionRisks = risks.filter(risk => (risk.GapDescription?.trim() || risk.RemediationPlan?.trim() || risk.ControlEffectiveness === 'Ineffective')).length;
    
    const totalIncidentsCount = risks.reduce((acc, risk) => acc + (risk.incidents?.length || 0), 0);
    const krisAtRiskCount = risks.filter(risk => risk.KRI && risk.kpiActual && risk.kpiTarget && parseFloat(risk.kpiActual) > parseFloat(risk.kpiTarget)).length;

    return { 
        stats: calculatedStats, 
        attentionRisks: calculatedAttentionRisks,
        totalIncidents: totalIncidentsCount,
        krisAtRisk: krisAtRiskCount
    };
  }, [risks]);

  return (
    <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard title="Total Risks" value={stats.total} color="text-cyan-300" />
            <StatCard title="High-Level Risks" value={stats.high} color="text-red-400" />
            <StatCard title="Total Incidents (Monitoring)" value={totalIncidents} color="text-orange-400" />
            <StatCard title="KRIs Above Target" value={krisAtRisk} color="text-amber-400" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartContainer title="Phase 3: Treatment (NCA ECC Implementation Status)" className="lg:col-span-2 min-h-[150px]">
                <ControlStatusChart assessments={eccAssessments} />
            </ChartContainer>
            
            <ChartContainer title="Phase 2: Evaluation (Risk Level Distribution)" className="min-h-[350px]">
                <RiskLevelPieChart data={{ high: stats.high, medium: stats.medium, low: stats.low }} />
            </ChartContainer>
            
            <ChartContainer title="Phase 2: Evaluation (Risk Matrix Heatmap)" className="min-h-[350px]">
                 <RiskHeatmap risks={risks} />
            </ChartContainer>

            <ChartContainer title="Phase 4: Monitoring (Incident Trends)" className="lg:col-span-2 min-h-[250px]">
                <div className="flex items-center justify-center h-full text-gray-500 italic">
                    {totalIncidents > 0 ? (
                        <div className="w-full space-y-4">
                            {risks.filter(r => r.incidents && r.incidents.length > 0).slice(0, 5).map(r => (
                                <div key={r.id} className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/10">
                                    <div>
                                        <p className="text-sm font-bold text-cyan-400">{r.RiskTitle}</p>
                                        <p className="text-xs text-gray-400">{r.incidents![0].description}</p>
                                    </div>
                                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">{r.incidents![0].date}</span>
                                </div>
                            ))}
                        </div>
                    ) : "No incidents recorded in the monitoring phase."}
                </div>
            </ChartContainer>

            <ChartContainer title="Top 5 Risk Owners" className="min-h-[300px]">
                <TopRiskOwnersChart risks={risks} />
            </ChartContainer>
             <ChartContainer title="Risks by Status" className="min-h-[300px]">
                <RiskStatusChart risks={risks} />
            </ChartContainer>
            <ChartContainer title="Control Effectiveness" className="lg:col-span-2 min-h-[250px]">
                <ControlEffectivenessChart risks={risks} />
            </ChartContainer>
        </div>
    </div>
  );
};

export default Dashboard;
