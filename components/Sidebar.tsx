
import React from 'react';
import { LogoIcon, DashboardIcon, TableIcon, GapAssessmentIcon, ShieldCheckIcon, ReportIcon, CriteriaIcon, IntegrationsIcon, AuditIcon } from './icons';
import { User } from 'firebase/auth';

type View = 'register' | 'dashboard' | 'gap' | 'criteria' | 'integrations' | 'ecc' | 'report' | 'audit' | 'admin';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  logoSrc: string | null;
  companyName: string;
  user: User | null;
  onLogout: () => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-3 rounded-lg text-gray-200 transition-colors duration-200 ${
        isActive
          ? 'bg-cyan-500/30 text-white font-semibold'
          : 'hover:bg-cyan-500/10'
      }`}
    >
      <span className="w-6 h-6 mr-3">{icon}</span>
      <span>{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, logoSrc, companyName, user, onLogout }) => {
  const navItems = [
    { view: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
    { view: 'register', icon: <TableIcon />, label: 'Risk Register' },
    { view: 'gap', icon: <GapAssessmentIcon />, label: 'Gap Assessment' },
    { view: 'ecc', icon: <ShieldCheckIcon />, label: 'NCA ECC' },
    { view: 'audit', icon: <AuditIcon />, label: 'Audit' },
    { view: 'report', icon: <ReportIcon />, label: 'Generate Report' },
  ] as const;

  const resourceItems = [
    { view: 'criteria', icon: <CriteriaIcon />, label: 'Risk Criteria' },
    { view: 'integrations', icon: <IntegrationsIcon />, label: 'Integrations' },
    { view: 'admin', icon: <ShieldCheckIcon />, label: 'Admin Portal' },
  ] as const;

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900/50 p-4 flex-col hidden md:flex print:hidden border-r border-slate-700">
      <div className="flex items-center gap-3 px-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            {logoSrc ? <img src={logoSrc} alt="Logo" className="h-8 w-8 object-contain rounded"/> : <LogoIcon className="h-6 w-6 text-cyan-500"/>}
        </div>
        <span className="font-bold text-lg text-white truncate">{companyName || 'Risk Register'}</span>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
            {navItems.map(item => (
                <NavItem 
                    key={item.view}
                    icon={item.icon}
                    label={item.label}
                    isActive={currentView === item.view}
                    onClick={() => onViewChange(item.view)}
                />
            ))}
        </ul>
      </nav>

      <div className="mt-auto space-y-4">
        {user && (
          <div className="px-3 py-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-cyan-500/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-500 font-bold text-xs">
                  {user.displayName?.charAt(0) || user.email?.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.displayName || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition text-left"
            >
              Sign Out
            </button>
          </div>
        )}
        <div>
          <p className="px-3 text-xs text-gray-500 uppercase font-semibold mb-2">Resources</p>
          <ul className="space-y-2">
              {resourceItems.map(item => (
                  <NavItem 
                      key={item.view}
                      icon={item.icon}
                      label={item.label}
                      isActive={currentView === item.view}
                      onClick={() => onViewChange(item.view)}
                  />
              ))}
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
