
import React, { useState } from 'react';
import { LogoIcon, PolicyIcon, TableIcon } from './icons';

interface InitialSetupProps {
  onLoadSample: () => void;
  onGenerate: () => Promise<void>;
  companyName: string;
  onLogin: () => void;
}

const InitialSetup: React.FC<InitialSetupProps> = ({ onLoadSample, onGenerate, companyName, onLogin }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = async () => {
    setIsGenerating(true);
    await onGenerate();
    // No need to set isGenerating to false, as the component will unmount on success
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
            <LogoIcon className="h-16 w-16 text-cyan-400" />
            <h1 className="text-4xl font-bold text-cyan-400">{companyName || 'Risk Assessment Register'}</h1>
        </div>
        <p className="text-lg text-gray-300 mb-10">Welcome! Please sign in to access your risk assessments.</p>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={onLogin}
            className="flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition shadow-xl shadow-cyan-500/20"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Sign in with Google
          </button>
          
          <div className="w-full max-w-md h-px bg-slate-700 my-4"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none">
          <button
            onClick={onLoadSample}
            className="p-8 bg-cyan-500/10 border-2 border-dashed border-cyan-500/30 rounded-lg flex flex-col items-center justify-center text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300"
          >
            <TableIcon className="h-12 w-12 mb-4" />
            <span className="text-xl font-semibold">Load Sample Risks</span>
            <span className="text-sm text-gray-400 mt-2">Start with a pre-defined set of common digital risks to explore the application's features.</span>
          </button>
          
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="p-8 bg-cyan-500/10 border-2 border-dashed border-cyan-500/30 rounded-lg flex flex-col items-center justify-center text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
          >
            <PolicyIcon className="h-12 w-12 mb-4" />
            <span className="text-xl font-semibold">{isGenerating ? 'Generating...' : 'Generate from Document'}</span>
            <span className="text-sm text-gray-400 mt-2">{isGenerating ? 'The AI is analyzing the risk document. This may take a moment...' : 'Use AI to analyze a provided risk document and automatically populate the risk register.'}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};

export default InitialSetup;
