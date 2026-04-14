import React from 'react';
import { PolicyIcon, ProjectIcon, SecurityIcon } from './icons';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTarget: (string) => void;
}

const AppCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onDeploy: () => void;
}> = ({ icon, title, description, onDeploy }) => (
  <div className="bg-white/5 p-6 rounded-lg border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:shadow-cyan-500/10 hover:border-white/20">
    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-dashed border-cyan-500/50 flex items-center justify-center text-cyan-300">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-cyan-200 mt-4">{title}</h3>
    <p className="text-gray-400 text-sm mt-2 flex-grow min-h-[40px]">{description}</p>
    <button
      onClick={onDeploy}
      className="mt-6 w-full px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-opacity-75"
    >
      Deploy to {title}
    </button>
  </div>
);

const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose, onSelectTarget }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      aria-labelledby="deploy-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl shadow-cyan-500/20 text-gray-200 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 id="deploy-modal-title" className="text-2xl font-bold text-cyan-500">
            Deploy with AI
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">&times;</button>
        </div>
        <div className="p-6">
            <p className="text-center text-gray-400 mb-8">
                Select an integration target. The AI Assistant will start to confirm the deployment and capture any relevant notes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AppCard
                    icon={<PolicyIcon className="h-8 w-8" />}
                    title="Compliance Tracker"
                    description="Sync risks to monitor regulatory adherence."
                    onDeploy={() => onSelectTarget('Compliance Tracker')}
                />
                <AppCard
                    icon={<ProjectIcon className="h-8 w-8" />}
                    title="Project Planner"
                    description="Create trackable tasks for remediation plans."
                    onDeploy={() => onSelectTarget('Project Planner')}
                />
                <AppCard
                    icon={<SecurityIcon className="h-8 w-8" />}
                    title="Security Dashboard"
                    description="Feed high-priority risks to your SOC."
                    onDeploy={() => onSelectTarget('Security Dashboard')}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default DeployModal;