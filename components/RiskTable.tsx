
import React, { useState, useMemo } from 'react';
import { Risk, RiskLevel, likelihoods, impacts, riskStatuses, controlEffectivenessOptions } from '../types';
import { DeleteIcon, GapIndicatorIcon, ShieldCheckIcon, MicrophoneIcon } from './icons';

interface RiskTableProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
  onDeleteRisk: (id: string, title: string) => void;
  companyName: string;
  assessorName: string;
  onStartAssessment: () => void;
  isAssistantActive: boolean;
}

const RiskLevelBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const levelStyles = {
    [RiskLevel.High]: 'bg-red-500/80 text-red-100',
    [RiskLevel.Medium]: 'bg-yellow-500/80 text-yellow-100',
    [RiskLevel.Low]: 'bg-cyan-500/80 text-white',
  };
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full ${levelStyles[level]}`}>
      {level}
    </span>
  );
};

const RiskTable: React.FC<RiskTableProps> = ({ risks, onSelectRisk, onDeleteRisk, companyName, assessorName, onStartAssessment, isAssistantActive }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [effectivenessFilter, setEffectivenessFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  const tableHeaders = [
    { name: "Risk ID", print: true, visible: true },
    { name: "Risk Title", print: true, visible: true },
    { name: "Type", print: false, visible: true },
    { name: "Description", print: true, visible: true },
    { name: "Risk Rating", print: false, visible: true },
    { name: "Likelihood", print: true, visible: true },
    { name: "Impact", print: true, visible: true },
    { name: "Mitigating Actions", print: true, visible: true },
    { name: "Risk Owner", print: true, visible: true },
    { name: "Stakeholders", print: true, visible: true },
    { name: "Status", print: true, visible: true },
    { name: "Linked Controls", print: false, visible: isAssistantActive },
    { name: "Risk Level", print: true, visible: true },
    { name: "Action", print: false, visible: true },
  ];

  const uniqueOwners = useMemo(() => {
    const owners = new Set(risks.map(r => r.RiskOwner).filter(Boolean));
    return Array.from(owners).sort();
  }, [risks]);
  
  const uniqueTypes = useMemo(() => {
    const types = new Set(risks.map(r => r.Type).filter(Boolean));
    return Array.from(types).sort();
  }, [risks]);

  const riskLevels = Object.values(RiskLevel);

  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch = searchTermLower === '' ||
        risk.RiskID.toLowerCase().includes(searchTermLower) ||
        risk.RiskTitle.toLowerCase().includes(searchTermLower) ||
        risk.Description.toLowerCase().includes(searchTermLower);

      const matchesStatus = statusFilter === '' || risk.Status === statusFilter;
      const matchesOwner = ownerFilter === '' || risk.RiskOwner === ownerFilter;
      const matchesEffectiveness = effectivenessFilter === '' || risk.ControlEffectiveness === effectivenessFilter;
      const matchesType = typeFilter === '' || risk.Type === typeFilter;
      const matchesLevel = levelFilter === '' || risk.RiskLevel === levelFilter;

      return matchesSearch && matchesStatus && matchesOwner && matchesEffectiveness && matchesType && matchesLevel;
    });
  }, [risks, searchTerm, statusFilter, ownerFilter, effectivenessFilter, typeFilter, levelFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setOwnerFilter('');
    setEffectivenessFilter('');
    setTypeFilter('');
    setLevelFilter('');
  };

  const shouldShowIndicator = (risk: Risk) => {
    return (
        (risk.GapDescription && risk.GapDescription.trim() !== '') ||
        (risk.RemediationPlan && risk.RemediationPlan.trim() !== '') ||
        risk.ControlEffectiveness === 'Ineffective'
    );
  };

  const printColumnCount = tableHeaders.filter(h => h.print).length;

  return (
    <div className="px-4 pb-8">
      <div className="pt-2 pb-4 md:flex md:items-center md:justify-between print:hidden">
        <div>
          <h2 className="text-2xl font-bold text-cyan-300">Risk Register</h2>
          <p className="text-gray-400 text-sm mt-1">A comprehensive list of all identified risks.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button 
            onClick={onStartAssessment} 
            disabled={isAssistantActive}
            className="flex items-center gap-2 px-4 py-2 border font-semibold rounded-lg shadow-md bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300 hover:shadow-cyan-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MicrophoneIcon /> Start Risk Assessment
          </button>
        </div>
      </div>
      <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10 print:hidden">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter by ID, Title, or Description..."
            className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <select
            className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by type"
          >
            <option value="">All Types</option>
            {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            {riskStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            aria-label="Filter by owner"
          >
            <option value="">All Owners</option>
            {uniqueOwners.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <select
            className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            aria-label="Filter by risk level"
          >
            <option value="">All Levels</option>
            {riskLevels.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select
            className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={effectivenessFilter}
            onChange={(e) => setEffectivenessFilter(e.target.value)}
            aria-label="Filter by control effectiveness"
          >
            <option value="">All Effectiveness</option>
            {controlEffectivenessOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg transition font-semibold"
          >
            Clear Filters
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="hidden print:block mb-4 text-black">
          <h2 className="text-xl font-bold">Risk Register - {companyName}</h2>
          <p className="text-sm">Assessor: {assessorName}</p>
        </div>
        <p className="text-sm text-gray-400 mb-2 print:hidden">
            Showing {filteredRisks.length} of {risks.length} risks.
        </p>
        <table className="min-w-full text-sm text-gray-300 border-collapse print:text-black">
          <thead className="bg-slate-800/60 print:bg-gray-200">
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.name} className={`p-2 border border-slate-700 font-semibold text-left print:border-gray-400 ${!header.print ? 'print:hidden' : ''} ${!header.visible ? 'hidden' : ''}`}>
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRisks.map((risk) => (
              <tr key={risk.id} onClick={() => onSelectRisk(risk.id)} className="hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer">
                <td className="p-2 border border-slate-700 print:border-gray-400">{risk.RiskID}</td>
                <td className="p-2 border border-slate-700 print:border-gray-400">
                  <div className="flex items-center gap-2">
                      <span>{risk.RiskTitle}</span>
                      {risk.isVitalFew && (
                          <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-500/30" title="Vital Few (80/20 Analysis)">
                              Vital Few
                          </span>
                      )}
                      {shouldShowIndicator(risk) && (
                          <div title="This risk has an identified gap, remediation plan, or ineffective controls.">
                              <GapIndicatorIcon className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                          </div>
                      )}
                      {risk.linkedControls && risk.linkedControls.length > 0 && !isAssistantActive && (
                          <div title={`${risk.linkedControls.length} linked NCA ECC control(s)`}>
                              <ShieldCheckIcon className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                          </div>
                      )}
                  </div>
                </td>
                <td className="p-2 border border-slate-700 print:border-gray-400 print:hidden">{risk.Type}</td>
                <td className="p-2 border border-slate-700 print:border-gray-400 whitespace-pre-wrap">{risk.Description}</td>
                <td className="p-2 border border-slate-700 print:border-gray-400 print:hidden">{risk.RiskRating}</td>
                <td className="p-2 border border-slate-700 print:border-gray-400 align-middle">
                  {likelihoods.find(l => l.value === risk.Likelihood)?.name || risk.Likelihood}
                </td>
                <td className="p-2 border border-slate-700 print:border-gray-400 align-middle">
                  {impacts.find(i => i.value === risk.Impact)?.name || risk.Impact}
                </td>
                <td className="p-2 border border-slate-700 print:border-gray-400 whitespace-pre-wrap">{risk.MitigatingActions}</td>
                <td className="p-2 border border-slate-700 print:border-gray-400">{risk.RiskOwner}</td>
                <td className="p-2 border border-slate-700 print:border-gray-400">{risk.Stakeholders || '-'}</td>
                <td className="p-2 border border-slate-700 print:border-gray-400">{risk.Status}</td>
                {isAssistantActive && (
                    <td className="p-2 border border-slate-700 text-center text-cyan-400 font-semibold print:hidden">
                        {risk.linkedControls?.length || 0}
                    </td>
                )}
                <td className="p-2 border border-slate-700 print:border-gray-400 text-center align-middle">
                  <RiskLevelBadge level={risk.RiskLevel} />
                </td>
                <td className="p-2 border border-slate-700 text-center print:border-gray-400 print:hidden">
                  <button onClick={(e) => { e.stopPropagation(); onDeleteRisk(risk.id, risk.RiskTitle); }} className="text-red-400 hover:text-red-300 transition-colors">
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="hidden print:table-footer-group">
              <tr>
                  <td colSpan={printColumnCount} className="pt-4 border-t-2 border-gray-400">
                      <div className="flex justify-end text-xs text-gray-600">
                          <span>Page <span className="page-number"></span></span>
                      </div>
                  </td>
              </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default RiskTable;
