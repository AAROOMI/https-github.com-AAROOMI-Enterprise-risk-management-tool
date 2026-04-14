
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, doc, setDoc, query, where } from 'firebase/firestore';
import { License, Client, UserRole } from '../types';
import { ShieldCheckIcon, KeyIcon, UserGroupIcon, PlusIcon, CheckCircleIcon } from './icons';

const AdminPortal: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [newClientName, setNewClientName] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');
  const [newClientOrg, setNewClientOrg] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [licenseType, setLicenseType] = useState<'Web' | 'AirGap' | 'Hardware'>('Web');

  useEffect(() => {
    const clientsRef = collection(db, 'admin', 'data', 'clients');
    const unsubscribeClients = onSnapshot(clientsRef, (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
    });

    const licensesRef = collection(db, 'admin', 'data', 'licenses');
    const unsubscribeLicenses = onSnapshot(licensesRef, (snapshot) => {
      setLicenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as License)));
    });

    return () => {
      unsubscribeClients();
      unsubscribeLicenses();
    };
  }, []);

  const handleAddClient = async () => {
    if (!newClientName || !newClientEmail) return;
    const clientData: Omit<Client, 'id'> = {
      name: newClientName,
      email: newClientEmail,
      organization: newClientOrg,
      licenses: []
    };
    await addDoc(collection(db, 'admin', 'data', 'clients'), clientData);
    setNewClientName('');
    setNewClientEmail('');
    setNewClientOrg('');
  };

  const generateLicense = async () => {
    if (!selectedClientId) return;
    
    const licenseKey = `GRC-${licenseType.toUpperCase()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    
    const licenseData: Omit<License, 'id'> = {
      key: licenseKey,
      clientId: selectedClientId,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      type: licenseType,
      status: 'Active',
      issuedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'admin', 'data', 'licenses'), licenseData);
    
    // Update client record
    const client = clients.find(c => c.id === selectedClientId);
    if (client) {
      await setDoc(doc(db, 'admin', 'data', 'clients', selectedClientId), {
        ...client,
        licenses: [...client.licenses, docRef.id]
      });
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-500/20 rounded-xl">
          <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
          <p className="text-gray-400">Manage client licenses and air-gap deployments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Management */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <UserGroupIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">Client Management</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            <input 
              type="text" 
              placeholder="Client Name" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
            />
            <input 
              type="email" 
              placeholder="Client Email" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              value={newClientEmail}
              onChange={(e) => setNewClientEmail(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="Organization" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
              value={newClientOrg}
              onChange={(e) => setNewClientOrg(e.target.value)}
            />
            <button 
              onClick={handleAddClient}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 rounded-lg transition flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" /> Add Client
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
            {clients.map(client => (
              <div key={client.id} className="p-4 bg-slate-900/30 border border-slate-700/50 rounded-xl flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.organization}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">
                    {client.licenses.length} Licenses
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* License Generation */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-6">
            <KeyIcon className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">License Generator</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Select Client</label>
              <select 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="">Choose a client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.organization})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Deployment Type</label>
              <div className="grid grid-cols-3 gap-3">
                {(['Web', 'AirGap', 'Hardware'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setLicenseType(type)}
                    className={`py-2 rounded-lg text-sm font-medium transition ${
                      licenseType === type 
                        ? 'bg-cyan-600 text-white border-cyan-500' 
                        : 'bg-slate-900/50 text-gray-400 border-slate-700 hover:bg-slate-700'
                    } border`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={generateLicense}
              disabled={!selectedClientId}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              Generate License Key
            </button>

            <div className="space-y-3 mt-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Licenses</h3>
              {licenses.slice(0, 5).map(license => (
                <div key={license.id} className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <code className="text-cyan-400 text-xs font-mono">{license.key}</code>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      license.type === 'AirGap' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      license.type === 'Hardware' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {license.type}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500">Issued to: {clients.find(c => c.id === license.clientId)?.name || 'Unknown'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
