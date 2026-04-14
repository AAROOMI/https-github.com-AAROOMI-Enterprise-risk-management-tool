import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
  logoSrc: string | null;
  companyName: string;
  assessorName: string;
  isOnline: boolean;
  onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCompanyNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAssessorNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header: React.FC<HeaderProps> = ({
  logoSrc,
  companyName,
  assessorName,
  isOnline,
  onLogoChange,
  onCompanyNameChange,
  onAssessorNameChange,
}) => {
  return (
    <header className="py-4 px-8 print:py-6 print:px-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <label htmlFor="logoUpload" className="cursor-pointer group">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-dashed border-cyan-500/50 flex items-center justify-center text-cyan-500 group-hover:bg-cyan-500/20 group-hover:border-cyan-500 transition-colors print:border-none print:p-0 print:bg-transparent">
              {logoSrc ? (
                <img src={logoSrc} alt="Company Logo" className="h-full w-full object-cover rounded-full" />
              ) : (
                <div className="text-center print:hidden">
                  <LogoIcon className="h-8 w-8 mx-auto" />
                  <p className="text-[10px] mt-1">Upload Logo</p>
                </div>
              )}
            </div>
          </label>
          <input type="file" id="logoUpload" accept="image/*" className="hidden" onChange={onLogoChange} />
          
          <div className="flex items-center gap-2 px-2 py-1 bg-slate-800/50 rounded-full border border-slate-700">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {isOnline ? 'Web Mode' : 'Air-Gap Mode'}
            </span>
          </div>
        </div>
        <div className="text-center text-gray-200 flex-grow print:text-black">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-500 print:text-black print:bg-none">
            Risk Assessment Report
          </h1>
          <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <input
              type="text"
              value={companyName}
              onChange={onCompanyNameChange}
              placeholder="Enter Company Name"
              className="bg-transparent border-b-2 border-cyan-500/50 focus:border-cyan-500 text-center text-lg w-64 outline-none transition print:border-none print:text-xl print:font-semibold"
            />
            <input
              type="text"
              value={assessorName}
              onChange={onAssessorNameChange}
              placeholder="Enter Assessor Name"
              className="bg-transparent border-b-2 border-cyan-500/50 focus:border-cyan-500 text-center text-lg w-64 outline-none transition print:border-none print:text-lg"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;