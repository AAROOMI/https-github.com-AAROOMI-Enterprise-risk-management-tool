import React from 'react';
import { 
    riskCategories, 
    likelihoods, 
    impacts, 
    calculateRiskMetrics, 
    RiskLevel 
} from '../types';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white/5 p-6 rounded-lg border border-white/10 mb-6">
    <h2 className="text-2xl font-bold text-cyan-300 mb-4">{title}</h2>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);

const ListItem: React.FC<{ term: string; definition: string; }> = ({ term, definition }) => (
    <p><strong className="font-semibold text-cyan-100">{term}</strong> – {definition}</p>
);

const RiskMatrix: React.FC = () => {
    const impactHeaders = impacts.map(i => `${i.name}`);
    const likelihoodHeaders = [...likelihoods].reverse().map(l => l.name.replace(/\(\d\)/, '').trim());
    
    const matrixData = [...likelihoods].reverse().map(l => {
        return impacts.map(i => {
            const { riskLevel } = calculateRiskMetrics(l.value, i.value);
            if (riskLevel === RiskLevel.High) return 'High 🔴';
            if (riskLevel === RiskLevel.Medium) return 'Med 🟡';
            return 'Low 🔵';
        });
    });

    const getCellColor = (value: string) => {
        if (value.includes('High')) return 'bg-red-500/30';
        if (value.includes('Med')) return 'bg-yellow-500/30';
        if (value.includes('Low')) return 'bg-cyan-500/30';
        return 'bg-gray-500/10';
    };

    return (
        <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-center border-collapse border border-slate-700">
                <thead className="bg-white/10">
                    <tr>
                        <th className="p-3 border-r border-slate-700 font-semibold text-cyan-200">Likelihood \ Impact</th>
                        {impactHeaders.map(header => (
                            <th key={header} className="p-3 border-r border-slate-700 font-semibold text-cyan-200">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {matrixData.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-white/5">
                            <td className="p-3 border-r border-slate-700 font-semibold text-cyan-200 text-left">{likelihoodHeaders[rowIndex]}</td>
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className={`p-3 border-r border-slate-700 font-bold transition-colors ${getCellColor(cell)}`}>
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const RiskCriteria: React.FC = () => {
  return (
    <div className="p-4 md:p-6 text-white">
        <h1 className="text-3xl lg:text-4xl font-bold text-center mb-8 text-cyan-500">
            Risk Assessment Criteria & Methodology
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
                <Section title="1. Risk Categories">
                    <p>{riskCategories.join(' | ')}</p>
                </Section>
                <Section title="2. Likelihood (12 months probability)">
                    {[...likelihoods].reverse().map(l => (
                        <ListItem key={l.value} term={`${l.name.replace(/\(\d\)/, '')}`} definition={l.description} />
                    ))}
                </Section>
                <Section title="3. Impact (Consequence)">
                     {impacts.map(i => (
                        <ListItem key={i.value} term={`${i.name.replace(/\(\d\)/, '')}`} definition={i.description} />
                     ))}
                </Section>
            </div>
            <div>
                 <Section title="4. Level of Risk (Likelihood × Impact)">
                    <ListItem term="High (15–25)" definition="Needs Action 🔴" />
                    <ListItem term="Medium (5–14)" definition="Needs Attention 🟡" />
                    <ListItem term="Low (1–4)" definition="No Attention 🔵" />
                </Section>
                 <Section title="5. Control Assessment">
                    <ListItem term="Effective" definition="Controls fully effective" />
                    <ListItem term="Strong" definition="Limited improvement opportunity" />
                    <ListItem term="Moderate" definition="Some improvements needed" />
                    <ListItem term="Needs Improvement" definition="Significant issues, high risk remains" />
                    <ListItem term="None" definition="No/ineffective controls" />
                </Section>
                <Section title="6. Risk Treatment Options">
                    <ListItem term="Avoid" definition="Stop risky activity" />
                    <ListItem term="Mitigate" definition="Reduce likelihood or impact" />
                    <ListItem term="Share/Transfer" definition="Outsource/insure/contract" />
                    <ListItem term="Accept" definition="Accept residual risk, monitor" />
                </Section>
            </div>
        </div>
        
        <div className="mt-6">
            <Section title="7. 5x5 Risk Matrix">
                <RiskMatrix />
            </Section>
        </div>
    </div>
  );
};

export default RiskCriteria;