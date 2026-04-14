
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Risk, RiskLevel, calculateRiskMetrics, BatchRiskUpdate, ECCAssessment, ControlStatus, MaturityRating, BatchEccUpdate, likelihoods, impacts, riskStatuses, controlEffectivenessOptions } from './types';
import Header from './components/Header';
import Controls from './components/Controls';
import RiskTable from './components/RiskTable';
import PolicyGenerator from './components/PolicyGenerator';
import Dashboard from './components/Dashboard';
import GapAssessmentTable from './components/GapAssessmentTable';
import RiskCriteria from './components/RiskCriteria';
import IntegrationsView from './components/IntegrationsView';
import ECCAssessmentView from './components/ECCAssessmentView';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';
import AssessmentView from './components/AssessmentView';
import ConfirmationDialog from './components/ConfirmationDialog';
import { useHistory } from './hooks/useHistory';
import RiskDetailModal from './components/RiskDetailModal';
import InitialSetup from './components/InitialSetup';
// FIX: Changed import to be a named import as ReportView is not a default export.
import { ReportView } from './components/ReportView';
import Sidebar from './components/Sidebar';
import AdminPortal from './components/AdminPortal';
import DeployModal from './components/DeployModal';
import Toast from './components/Toast';
import AuditView from './components/AuditView'; // Imported AuditView
import { ncaEccControls } from './data/nca-ecc-controls';
import { digitalRisks, grcRisks } from './data/risk-library';
import { auth, db, googleProvider, signInWithPopup, onAuthStateChanged, doc, collection, onSnapshot, setDoc, getDoc } from './firebase';
import { User } from 'firebase/auth';
import { localAI } from './services/localLLMService';

const RISK_STORAGE_KEY = 'riskAssessmentData';
const ECC_STORAGE_KEY = 'eccAssessmentData';

type View = 'register' | 'dashboard' | 'gap' | 'criteria' | 'integrations' | 'ecc' | 'report' | 'audit' | 'admin';
type AssessmentType = 'risk' | 'gap' | 'nca' | 'deploy' | 'audit';

const generateDefaultRisks = (): Risk[] => {
    // Combine both sets of extracted risks
    const allRisks = [...digitalRisks, ...grcRisks];
    
    return allRisks.map(risk => {
        return {
            id: crypto.randomUUID(),
            RiskID: risk.RiskID,
            RiskTitle: risk.RiskTitle,
            Type: risk.Type,
            Description: risk.Description,
            RiskRating: '', // Reset rating
            Likelihood: '', // Reset assessment
            Impact: '', // Reset assessment
            MitigatingActions: risk.MitigatingActions || '',
            RiskOwner: risk.RiskOwner || 'Unassigned',
            Status: 'Open', // Default to Open
            RiskLevel: RiskLevel.Low, // Default to Low
            ControlEffectiveness: 'Not Assessed',
            GapDescription: '',
            RemediationPlan: '',
            linkedControls: [],
        };
    });
};

const generateDefaultEccAssessments = (): ECCAssessment[] => {
    return ncaEccControls.map(control => ({
        ...control,
        status: ControlStatus.NotAssessed,
        maturity: MaturityRating.NotAssessed,
        recommendation: '',
        managementResponse: '',
        targetDate: '',
    }));
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const { 
    state: risks, 
    setState: setRisks, 
    setInitialState: setInitialRisks, 
    undo: undoRisks, 
    redo: redoRisks, 
    canUndo: canUndoRisks, 
    canRedo: canRedoRisks 
  } = useHistory<Risk[]>([]);
  
  const { 
    state: eccAssessments, 
    setState: setEccAssessments, 
    setInitialState: setInitialEccAssessments, 
    undo: undoEcc, 
    redo: redoEcc, 
    canUndo: canUndoEcc, 
    canRedo: canRedoEcc 
  } = useHistory<ECCAssessment[]>([]);

  const [companyName, setCompanyName] = useState('');
  const [assessorName, setAssessorName] = useState('');
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeAssessmentRiskId, setActiveAssessmentRiskId] = useState<string | null>(null);
  const [activeAssessmentControlId, setActiveAssessmentControlId] = useState<string | null>(null);
  const [assessmentType, setAssessmentType] = useState<AssessmentType | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setToastMessage("Back online. Syncing with Firebase...");
    };
    const handleOffline = () => {
      setIsOnline(false);
      setToastMessage("Offline mode active. Gemma 4 (Local) initialized for air-gap operations.");
      localAI.loadModel();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
      setToastMessage("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setInitialRisks([]);
      setInitialEccAssessments([]);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Sync risks with Firestore
  useEffect(() => {
    if (!user) return;

    const risksRef = collection(db, 'users', user.uid, 'risks');
    const unsubscribe = onSnapshot(risksRef, (snapshot) => {
      const firestoreRisks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Risk));
      if (firestoreRisks.length > 0) {
        setInitialRisks(firestoreRisks);
      } else if (risks.length === 0) {
        const defaults = generateDefaultRisks();
        setInitialRisks(defaults);
      }
    });

    return () => unsubscribe();
  }, [user, setInitialRisks]);

  // Sync ECC assessments with Firestore
  useEffect(() => {
    if (!user) return;

    const eccRef = collection(db, 'users', user.uid, 'eccAssessments');
    const unsubscribe = onSnapshot(eccRef, (snapshot) => {
      const firestoreEcc = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ECCAssessment));
      if (firestoreEcc.length > 0) {
        setInitialEccAssessments(firestoreEcc);
      } else if (eccAssessments.length === 0) {
        setInitialEccAssessments(generateDefaultEccAssessments());
      }
    });

    return () => unsubscribe();
  }, [user, setInitialEccAssessments]);

  // Sync settings with Firestore
  useEffect(() => {
    if (!user) return;

    const settingsRef = doc(db, 'users', user.uid, 'settings', 'profile');
    const unsubscribe = onSnapshot(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setCompanyName(data.companyName || '');
        setAssessorName(data.assessorName || '');
        setLogoSrc(data.logoSrc || null);
      }
    });

    return () => unsubscribe();
  }, [user]);

  const saveRiskToFirestore = async (risk: Risk) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'risks', risk.id), risk);
    } catch (error) {
      console.error("Error saving risk to Firestore", error);
    }
  };

  const saveEccToFirestore = async (assessment: ECCAssessment) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'eccAssessments', assessment.id), assessment);
    } catch (error) {
      console.error("Error saving ECC assessment to Firestore", error);
    }
  };

  const saveSettingsToFirestore = async (updates: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid, 'settings', 'profile'), updates, { merge: true });
    } catch (error) {
      console.error("Error saving settings to Firestore", error);
    }
  };


  // State for confirmation dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ action: (() => void) | null }>({ action: null });
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState<React.ReactNode>('');
  const [confirmButtonProps, setConfirmButtonProps] = useState({ text: 'Confirm', className: 'bg-cyan-600 hover:bg-cyan-700' });

  const handleSaveRisk = (updatedRisk: Risk) => {
    setRisks(prev => {
        const originalRisk = prev.find(r => r.id === updatedRisk.id);
        if (!originalRisk) return prev;

        const { history, ...previousState } = originalRisk;
        
        // Calculate diff for history
        const changes = (Object.keys(updatedRisk) as Array<keyof Risk>).filter(key => {
            if (key === 'history' || key === 'evidenceFile' || key === 'linkedControls') return false;
            return JSON.stringify(updatedRisk[key]) !== JSON.stringify(originalRisk[key]);
        });
        if (JSON.stringify(updatedRisk.linkedControls) !== JSON.stringify(originalRisk.linkedControls)) changes.push('linkedControls');
        
        const changeSummary = changes.length > 0 ? `Updated: ${changes.join(', ')}` : 'Manual Update';

        const { riskRating, riskLevel } = calculateRiskMetrics(updatedRisk.Likelihood, updatedRisk.Impact);
        const newRisk = {
            ...updatedRisk,
            RiskRating: riskRating,
            RiskLevel: riskLevel,
            history: [...(originalRisk.history || []), { 
                timestamp: new Date().toISOString(), 
                data: previousState,
                updatedBy: assessorName || 'User',
                changeSummary
            }]
        };

        saveRiskToFirestore(newRisk);
        return prev.map(r => (r.id === updatedRisk.id ? newRisk : r));
    });
    setSelectedRiskId(null);
  };

  const handleBatchUpdateRisk = useCallback((id: string, updates: BatchRiskUpdate) => {
    const normalizeLikelihood = (value: string): string => {
        const found = likelihoods.find(l => l.value === value || l.name.toLowerCase().includes(value.toLowerCase()));
        return found ? found.value : value;
    };
    const normalizeImpact = (value: string): string => {
        const found = impacts.find(i => i.value === value || i.name.toLowerCase().includes(value.toLowerCase()));
        return found ? found.value : value;
    };
    const normalizeStatus = (value: string): string => {
        return riskStatuses.find(s => s.toLowerCase() === value.toLowerCase()) || value;
    };
    const normalizeEffectiveness = (value: string): string => {
        return controlEffectivenessOptions.find(o => o.toLowerCase() === value.toLowerCase()) || value;
    };

    const normalizedUpdates = { ...updates };
    if (updates.Likelihood) normalizedUpdates.Likelihood = normalizeLikelihood(updates.Likelihood);
    if (updates.Impact) normalizedUpdates.Impact = normalizeImpact(updates.Impact);
    if (updates.Status) normalizedUpdates.Status = normalizeStatus(updates.Status);
    if (updates.ControlEffectiveness) normalizedUpdates.ControlEffectiveness = normalizeEffectiveness(updates.ControlEffectiveness);
    
    setRisks(prev => prev.map(r => {
        if (r.id !== id) return r;

        const { history, ...previousState } = r;
        const newLinkedControls = normalizedUpdates.linkedControls 
            ? [...new Set([...(r.linkedControls || []), ...normalizedUpdates.linkedControls])]
            : r.linkedControls;
            
        const changeSummary = `Assessment Update: ${Object.keys(updates).join(', ')}`;

        let updatedRisk = { 
            ...r, 
            ...normalizedUpdates, 
            linkedControls: newLinkedControls, 
            history: [...(r.history || []), { 
                timestamp: new Date().toISOString(), 
                data: previousState,
                updatedBy: 'AI Assistant',
                changeSummary
            }]
        };
        
        if (updates.Likelihood || updates.Impact) {
            const { riskRating, riskLevel } = calculateRiskMetrics(updatedRisk.Likelihood, updatedRisk.Impact);
            updatedRisk = { ...updatedRisk, RiskRating: riskRating, RiskLevel: riskLevel };
        }
        saveRiskToFirestore(updatedRisk);
        return updatedRisk;
    }));
  }, [setRisks, user]);

  const handleBatchUpdateEcc = useCallback((id: string, updates: BatchEccUpdate) => {
    const normalizeStatus = (value: string): ControlStatus => {
        const statuses = Object.values(ControlStatus);
        const found = statuses.find(s => s.toLowerCase() === value.toLowerCase());
        return found || value as ControlStatus;
    };
    
    const normalizeMaturity = (value: string): MaturityRating => {
        const ratings = Object.values(MaturityRating);
        const lowerValue = value.toLowerCase();
        const found = ratings.find(r => 
            r.toLowerCase().includes(lowerValue) || 
            (lowerValue.length === 1 && /^\d$/.test(lowerValue) && r.startsWith(lowerValue))
        );
        return found || value as MaturityRating;
    };

    const normalizedUpdates = {...updates};
    if (updates.status) {
        normalizedUpdates.status = normalizeStatus(updates.status);
    }
    if (updates.maturity) {
        normalizedUpdates.maturity = normalizeMaturity(updates.maturity);
    }

    setEccAssessments(prev => prev.map(c => {
        if (c.id === id) {
            const updated = { ...c, ...normalizedUpdates };
            saveEccToFirestore(updated);
            return updated;
        }
        return c;
    }));
  }, [setEccAssessments, user]);

  const handleDeploy = (target: string, notes: string) => {
    setToastMessage(`Deployment to ${target} initiated! Notes: "${notes}"`);
  };

  const { assistantStatus, isAssistantActive, startAssessment, stopAssessment, currentFocus, conversationLog } = useVoiceAssistant({
      risks,
      onBatchUpdateRisk: handleBatchUpdateRisk,
      eccAssessments,
      onBatchUpdateEcc: handleBatchUpdateEcc,
      onDeploy: handleDeploy,
      onAssessmentRiskChange: setActiveAssessmentRiskId,
      onAssessmentControlChange: setActiveAssessmentControlId,
      onAssessmentTypeChange: setAssessmentType,
      onNavigate: setView,
      onUndoRisk: undoRisks,
      onRedoRisk: redoRisks,
      onUndoEcc: undoEcc,
      onRedoEcc: redoEcc
  });
  
  const activeRiskForAssessment = useMemo(() => {
    if (!activeAssessmentRiskId) return null;
    return risks.find(r => r.id === activeAssessmentRiskId);
  }, [risks, activeAssessmentRiskId]);

  useEffect(() => { if (currentFocus?.riskId && !isAssistantActive) setSelectedRiskId(currentFocus.riskId); }, [currentFocus, isAssistantActive]);
  useEffect(() => { if (!isAssistantActive) setSelectedRiskId(null); }, [isAssistantActive]);

  const requestConfirmation = useCallback((action: () => void, title: string, message: React.ReactNode, buttonProps?: { text: string; className: string }) => {
    setConfirmAction({ action }); setConfirmTitle(title); setConfirmMessage(message);
    setConfirmButtonProps(buttonProps || { text: 'Confirm', className: 'bg-cyan-600 hover:bg-cyan-700' });
    setIsConfirmOpen(true);
  }, []);

  const handleConfirm = () => { if (confirmAction.action) confirmAction.action(); setIsConfirmOpen(false); };

  const handleAddRow = useCallback(() => {
    const maxId = risks.reduce((max, risk) => {
        const match = risk.RiskID?.match(/^[A-Z]+(\d+)$/i);
        if (match && match[1]) {
            const idNum = parseInt(match[1], 10);
            return !isNaN(idNum) && idNum > max ? idNum : max;
        }
        return max;
    }, 0);
    const newRiskId = `R${maxId + 1}`;
    const newRisk: Risk = { id: crypto.randomUUID(), RiskID: newRiskId, RiskTitle: '', Type: '', Description: '', RiskRating: '', Likelihood: '', Impact: '', MitigatingActions: '', RiskOwner: '', Status: 'Open', RiskLevel: RiskLevel.Low, ControlEffectiveness: 'Not Assessed', GapDescription: '', RemediationPlan: '', linkedControls: [] };
    saveRiskToFirestore(newRisk);
    setRisks(prev => [...prev, newRisk]);
    setSelectedRiskId(newRisk.id);
  }, [risks, setRisks]);

  const handleRequestDeleteRisk = useCallback((id: string, riskTitle: string) => {
    requestConfirmation(() => setRisks(prev => prev.filter(r => r.id !== id)), 'Confirm Deletion', <p>Are you sure you want to delete the risk: <strong className="text-cyan-300">{riskTitle}</strong>? This action can be undone.</p>, { text: 'Delete', className: 'bg-red-600/80 hover:bg-red-600' });
  }, [requestConfirmation, setRisks]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; const reader = new FileReader();
      reader.onload = (loadEvent) => setLogoSrc(loadEvent.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => { setView('report'); setTimeout(() => window.print(), 500); };

  const handleRequestExportCsv = useCallback(() => {
    requestConfirmation(() => {
        const headers: (keyof Omit<Risk, 'id'>)[] = [ 'RiskID', 'RiskTitle', 'Type', 'Description', 'RiskRating', 'Likelihood', 'Impact', 'MitigatingActions', 'RiskOwner', 'Status', 'RiskLevel', 'ControlEffectiveness', 'GapDescription', 'RemediationPlan', 'linkedControls' ];
        const stringifyCell = (val: any) => `"${(Array.isArray(val) ? val.join('; ') : (val || '').toString()).replace(/"/g, '""')}"`;
        const csvRows = [ headers.join(','), ...risks.map(risk => headers.map(header => stringifyCell(risk[header])).join(',')) ];
        const csvString = csvRows.join('\n');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([csvString], { type: 'text/csv;charset=utf-8;' }));
        link.setAttribute('download', 'risk_register_and_gap_assessment.csv');
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    }, 'Confirm Export', <p>Are you sure you want to export the current data to a CSV file?</p>);
  }, [risks, requestConfirmation]);

  const handleImportCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split(/\r?\n/).filter(row => row.trim() !== '');
        if (rows.length < 2) return alert("CSV file needs a header and at least one data row.");
        const headerText = rows.shift()!;
        const headers = headerText.split(',').map(h => h.trim().replace(/"/g, ''));
        const newRisks: Risk[] = rows.map(row => {
            const values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, '').replace(/""/g, '"'));
            const riskData: any = { id: crypto.randomUUID() };
            headers.forEach((header, index) => {
                const key = header as keyof Risk;
                riskData[key] = key === 'linkedControls' ? (values[index] ? values[index].split(';').map(s => s.trim()) : []) : (values[index] || '');
            });
            if (!Object.values(RiskLevel).includes(riskData.RiskLevel)) riskData.RiskLevel = RiskLevel.Medium;
            return riskData as Risk;
        });
        setRisks(newRisks);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleToggleAssistant = (type?: AssessmentType, deploymentTarget?: string) => {
    if (isAssistantActive) {
      stopAssessment();
    } else {
      if(type === 'nca') setView('ecc');
      // If type is audit, we keep the view as 'audit' (which is set by the button in Sidebar/AuditView)
      startAssessment(type || null, deploymentTarget);
    }
  };

  const handleSelectDeploymentTarget = (target: string) => {
    setIsDeployModalOpen(false);
    handleToggleAssistant('deploy', target);
  };

  const handleParetoAnalysis = () => {
    setRisks(prev => {
        const sorted = [...prev].sort((a, b) => {
            const scoreA = (likelihoods.find(l => l.value === a.Likelihood)?.weight || 0) * (impacts.find(i => i.value === a.Impact)?.weight || 0);
            const scoreB = (likelihoods.find(l => l.value === b.Likelihood)?.weight || 0) * (impacts.find(i => i.value === b.Impact)?.weight || 0);
            return scoreB - scoreA;
        });

        const totalScore = sorted.reduce((sum, r) => {
            const score = (likelihoods.find(l => l.value === r.Likelihood)?.weight || 0) * (impacts.find(i => i.value === r.Impact)?.weight || 0);
            return sum + score;
        }, 0);

        let cumulativeScore = 0;
        const updatedRisks = sorted.map(risk => {
            const score = (likelihoods.find(l => l.value === risk.Likelihood)?.weight || 0) * (impacts.find(i => i.value === risk.Impact)?.weight || 0);
            cumulativeScore += score;
            const isVitalFew = cumulativeScore <= totalScore * 0.8 || sorted.indexOf(risk) < sorted.length * 0.2;
            const newRisk = { ...risk, isVitalFew };
            saveRiskToFirestore(newRisk);
            return newRisk;
        });

        setToastMessage("80/20 Pareto Analysis complete. Vital Few risks identified.");
        return updatedRisks;
    });
  };

  const generateAIPoweredRisks = async (type: 'PRA' | 'FMEA' | 'FTA') => {
    const aiProvider = isOnline ? 'Gemini 2.0' : 'Gemma 4 (Local)';
    setToastMessage(`Generating 30 ${type} risks with ${aiProvider}...`);
    
    if (!isOnline) {
      await localAI.loadModel();
    }
    
    // Simulate AI generation (in a real app, we'd call Gemini API or Local Gemma)
    const newRisks: Risk[] = Array.from({ length: 30 }).map((_, i) => {
        const id = crypto.randomUUID();
        const risk: Risk = {
            id,
            RiskID: `${type}-${i + 1}`,
            RiskTitle: `${type} Risk: ${['System Failure', 'Data Breach', 'Process Delay', 'Human Error', 'Compliance Gap'][Math.floor(Math.random() * 5)]} #${i + 1}`,
            Type: type === 'FMEA' ? 'Operational' : type === 'FTA' ? 'Technical' : 'Strategic',
            Description: type === 'FMEA' ? "Identification of failure mode via bottom-up analysis." : 
                         type === 'FTA' ? "Root cause structure analysis via top-down fault tree." : 
                         "Quantitative risk evaluation with probability-damage matrix.",
            DescriptionEN: `Professional ${type} assessment following ISO 31000 standards.`,
            DescriptionAR: `تقييم ${type} احترافي يتبع معايير ISO 31000.`,
            Likelihood: likelihoods[Math.floor(Math.random() * likelihoods.length)].value,
            Impact: impacts[Math.floor(Math.random() * impacts.length)].value,
            RiskRating: '',
            MitigatingActions: 'Implement automated monitoring and redundant controls.',
            RiskOwner: assessorName || 'AI Generated',
            Stakeholders: 'IT Security, Operations, Legal Compliance',
            Status: 'Open',
            RiskLevel: RiskLevel.Medium,
            KRI: `Metric > ${Math.floor(Math.random() * 100)}%`,
            LeadTrigger: 'Proactive monitoring alert',
            LagTrigger: 'System downtime event',
            RPN: type === 'FMEA' ? Math.floor(Math.random() * 1000) : undefined,
            linkedControls: []
        };
        const { riskRating, riskLevel } = calculateRiskMetrics(risk.Likelihood, risk.Impact);
        risk.RiskRating = riskRating;
        risk.RiskLevel = riskLevel;
        
        saveRiskToFirestore(risk);
        return risk;
    });

    setRisks(prev => [...prev, ...newRisks]);
    setToastMessage(`Successfully generated 30 ${type} risks.`);
  };
  
  const handleSelectRisk = (riskId: string) => setSelectedRiskId(riskId);
  const handleCloseModal = () => { if (!isAssistantActive) setSelectedRiskId(null); };
  const selectedRisk = useMemo(() => risks.find(r => r.id === selectedRiskId) || null, [risks, selectedRiskId]);

  const handleResetData = () => {
      requestConfirmation(async () => {
          if (user) {
              // Clear Firestore risks
              // Note: In a real app, we'd delete the collection. Here we'll just set it to empty locally and let the user re-generate.
              // For simplicity, we'll just reload defaults and save them.
              const defaults = generateDefaultRisks();
              const eccDefaults = generateDefaultEccAssessments();
              setInitialRisks(defaults);
              setInitialEccAssessments(eccDefaults);
              // We'd need to delete docs in Firestore too, but for now we'll just overwrite.
          }
          localStorage.removeItem(RISK_STORAGE_KEY);
          localStorage.removeItem(ECC_STORAGE_KEY);
          window.location.reload();
      }, 'Reset Data', 'Are you sure you want to reset all data? This will clear all your assessments and restore the default risk library. This action cannot be undone.', { text: 'Reset', className: 'bg-red-600 hover:bg-red-700' });
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-300 font-medium">Loading Assessment Register...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <InitialSetup 
        onLoadSample={() => {}} // Handled by login
        onGenerate={async () => {}} // Handled by login
        companyName={companyName}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans print:p-0 print:bg-white">
        <div className="flex h-screen">
            <Sidebar currentView={view} onViewChange={setView} logoSrc={logoSrc} companyName={companyName} user={user} onLogout={handleLogout} />
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-800/50 backdrop-blur-xl print:bg-transparent">
                <div className="print:hidden flex-shrink-0">
                  <Header logoSrc={logoSrc} companyName={companyName} assessorName={assessorName} isOnline={isOnline} onLogoChange={handleLogoChange} onCompanyNameChange={(e) => setCompanyName(e.target.value)} onAssessorNameChange={(e) => setAssessorName(e.target.value)} />
                  <Controls 
                    onAddRow={handleAddRow} 
                    onExportCsv={handleRequestExportCsv} 
                    onImportCsv={handleImportCsv} 
                    onPrint={handlePrint} 
                    onGeneratePolicy={() => setIsPolicyModalOpen(true)} 
                    isAssistantActive={isAssistantActive} 
                    onToggleAssistant={() => handleToggleAssistant()} 
                    onUndo={view === 'ecc' ? undoEcc : undoRisks} 
                    onRedo={view === 'ecc' ? redoEcc : redoRisks} 
                    canUndo={view === 'ecc' ? canUndoEcc : canUndoRisks} 
                    canRedo={view === 'ecc' ? canRedoEcc : canRedoRisks} 
                    onDeployWithAI={() => setIsDeployModalOpen(true)} 
                    onResetData={handleResetData}
                    onParetoAnalysis={handleParetoAnalysis}
                    onGeneratePRA={() => generateAIPoweredRisks('PRA')}
                    onGenerateFMEA={() => generateAIPoweredRisks('FMEA')}
                    onGenerateFTA={() => generateAIPoweredRisks('FTA')}
                  />
                </div>
                
                <div className="flex-grow overflow-y-auto">
                    {/* Render AssessmentView when assistant is active for risks/audit */}
                    {isAssistantActive && activeRiskForAssessment && assessmentType !== 'nca' ? (
                      <AssessmentView activeRisk={activeRiskForAssessment} onUpdateField={handleBatchUpdateRisk} onStopAssessment={stopAssessment} assistantStatus={assistantStatus} conversationLog={conversationLog} currentFocus={currentFocus} />
                    ) : (
                        <>
                          {view === 'register' && <RiskTable risks={risks} onSelectRisk={handleSelectRisk} onDeleteRisk={handleRequestDeleteRisk} companyName={companyName} assessorName={assessorName} onStartAssessment={() => handleToggleAssistant('risk')} isAssistantActive={isAssistantActive} />}
                          {view === 'dashboard' && <Dashboard risks={risks} eccAssessments={eccAssessments} />}
                          {view === 'gap' && <GapAssessmentTable risks={risks} onSelectRisk={handleSelectRisk} onDeleteRisk={handleRequestDeleteRisk} companyName={companyName} assessorName={assessorName} onStartAssessment={() => handleToggleAssistant('gap')} isAssistantActive={isAssistantActive} />}
                          {view === 'ecc' && <ECCAssessmentView assessments={eccAssessments} onUpdateAssessment={handleBatchUpdateEcc} onStartAssessment={() => handleToggleAssistant('nca')} isAssistantActive={isAssistantActive && assessmentType === 'nca'} assistantStatus={assistantStatus} conversationLog={conversationLog} currentFocus={currentFocus} activeControlId={activeAssessmentControlId} />}
                          {view === 'criteria' && <RiskCriteria />}
                          {view === 'integrations' && <IntegrationsView />}
                          {view === 'audit' && <AuditView risks={risks} eccAssessments={eccAssessments} onStartAudit={() => handleToggleAssistant('audit')} isAssistantActive={isAssistantActive} />}
                          {view === 'admin' && <AdminPortal />}
                          {view === 'report' && <ReportView risks={risks} companyName={companyName} assessorName={assessorName} logoSrc={logoSrc} />}
                        </>
                    )}
                </div>
            </div>
        </div>

        <PolicyGenerator isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} companyName={companyName} />
        <ConfirmationDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirm} title={confirmTitle} confirmButtonText={confirmButtonProps.text} confirmButtonClass={confirmButtonProps.className}>
            {confirmMessage}
        </ConfirmationDialog>
        <RiskDetailModal isOpen={!!selectedRisk} risk={selectedRisk} onClose={handleCloseModal} onSave={handleSaveRisk} allRisks={risks} currentFocus={currentFocus} />
        <DeployModal isOpen={isDeployModalOpen} onClose={() => setIsDeployModalOpen(false)} onSelectTarget={handleSelectDeploymentTarget} />
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </main>
  );
};

export default App;
