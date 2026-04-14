import React, { useState, useEffect } from 'react';
import { PolicyIcon, ProjectIcon, SecurityIcon, LinkIcon } from './icons';

interface IntegrationCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    appUrl?: string;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({ icon, title, description, appUrl }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="bg-white/5 p-6 rounded-lg border border-white/10 flex flex-col items-center text-center transition-all duration-300 hover:shadow-cyan-500/10 hover:-translate-y-1">
      <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-dashed border-cyan-500/50 flex items-center justify-center text-cyan-300">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-cyan-200 mt-4">{title}</h3>
      <p className="text-gray-400 text-sm mt-2 flex-grow min-h-[60px]">{description}</p>
      
      <div className="mt-6 w-full space-y-2">
        <button
            onClick={() => setIsConnected(prev => !prev)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className={`w-full px-6 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${
                isConnected
                ? 'bg-red-500/20 border border-red-400/40 text-red-300 hover:bg-red-500/30 focus:ring-red-400'
                : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 focus:ring-cyan-500'
            }`}
        >
            {isConnected ? (isHovering ? 'Disconnect' : '✓ Connected') : 'Connect'}
        </button>
        
        {isConnected && appUrl && (
             <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-2 rounded-lg font-semibold transition-all duration-300 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-75"
            >
                Launch App
            </a>
        )}
      </div>
    </div>
  );
};

const IntegrationsView: React.FC = () => {
    const [customAppName, setCustomAppName] = useState('');
    const [customAppUrl, setCustomAppUrl] = useState('');
    const [isUrlValid, setIsUrlValid] = useState(false);

    const CUSTOM_APP_NAME_KEY = 'customIntegrationName';
    const CUSTOM_APP_URL_KEY = 'customIntegrationUrl';

    // Load from localStorage on mount
    useEffect(() => {
        const savedName = localStorage.getItem(CUSTOM_APP_NAME_KEY);
        const savedUrl = localStorage.getItem(CUSTOM_APP_URL_KEY);
        if (savedName) setCustomAppName(savedName);
        if (savedUrl) setCustomAppUrl(savedUrl);
    }, []);

    // Save to localStorage and validate URL on change
    useEffect(() => {
        localStorage.setItem(CUSTOM_APP_NAME_KEY, customAppName);
        try {
            new URL(customAppUrl);
            setIsUrlValid(true);
        } catch (_) {
            setIsUrlValid(false);
        }
        localStorage.setItem(CUSTOM_APP_URL_KEY, customAppUrl);
    }, [customAppName, customAppUrl]);


  return (
    <div className="p-4 md:p-6 text-white">
      <h1 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-cyan-500">
        Application Integrations
      </h1>
      <p className="text-center text-gray-400 max-w-3xl mx-auto mb-10">
        Connect your Risk Register with other applications from aistudio.google.com to create a seamless workflow. While direct API integrations are in development, you can currently use data exports to share information between tools.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <IntegrationCard
          icon={<PolicyIcon className="h-8 w-8" />}
          title="Compliance Tracker"
          description="Automatically sync identified risks with your compliance framework to monitor regulatory adherence and generate reports."
          appUrl="https://aistudio.google.com/app/compliance-tracker"
        />
        <IntegrationCard
          icon={<ProjectIcon className="h-8 w-8" />}
          title="Project Planner"
          description="Link risks to specific projects and tasks. Remediation plans can become trackable items for your project teams."
          appUrl="https://aistudio.google.com/app/project-planner"
        />
        <IntegrationCard
          icon={<SecurityIcon className="h-8 w-8" />}
          title="Security Dashboard"
          description="Feed high-priority cybersecurity risks directly into your Security Operations Center (SOC) dashboard for real-time monitoring."
          appUrl="https://aistudio.google.com/app/security-dashboard"
        />
      </div>

      <div className="mt-12 bg-white/5 p-6 rounded-lg border border-white/10 transition-all duration-300 hover:shadow-cyan-500/10 hover:border-white/20">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-dashed border-cyan-500/50 flex items-center justify-center text-cyan-300 flex-shrink-0">
                    <LinkIcon className="h-8 w-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-cyan-300">Link Your Application</h2>
                    <p className="text-gray-400">Create a direct link to another application or resource.</p>
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <label htmlFor="customAppName" className="block text-sm font-medium text-cyan-300 mb-1">Application Name</label>
                    <input
                        id="customAppName"
                        type="text"
                        value={customAppName}
                        onChange={(e) => setCustomAppName(e.target.value)}
                        placeholder="e.g., My Company Dashboard"
                        className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                    />
                </div>
                <div>
                    <label htmlFor="customAppUrl" className="block text-sm font-medium text-cyan-300 mb-1">Application URL</label>
                    <input
                        id="customAppUrl"
                        type="url"
                        value={customAppUrl}
                        onChange={(e) => setCustomAppUrl(e.target.value)}
                        placeholder="https://..."
                        className={`w-full bg-slate-900/50 border rounded-md p-2 outline-none focus:ring-2 focus:border-cyan-500 transition ${isUrlValid || customAppUrl === '' ? 'border-slate-600' : 'border-red-500 focus:ring-red-500'}`}
                    />
                </div>
                <a
                    href={isUrlValid ? customAppUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center px-6 py-2 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-75 mt-2 ${
                        isUrlValid
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 focus:ring-cyan-500 cursor-pointer'
                        : 'bg-gray-500/20 border border-gray-400/40 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => !isUrlValid && e.preventDefault()}
                >
                    Launch {customAppName || 'Application'}
                </a>
            </div>
        </div>

      <div className="mt-12 bg-white/5 p-6 rounded-lg border border-white/10">
         <h2 className="text-2xl font-bold text-cyan-300 mb-4">Current Capabilities: Data Export</h2>
         <p className="text-gray-300">
           This application supports exporting all risk and gap assessment data to a CSV file. This is the primary method for transferring data to other tools. Use the <span className="font-semibold text-cyan-200">Export CSV</span> button in the control bar above to download your data. This allows for easy import into spreadsheets or other applications that support CSV format.
         </p>
      </div>
    </div>
  );
};

export default IntegrationsView;