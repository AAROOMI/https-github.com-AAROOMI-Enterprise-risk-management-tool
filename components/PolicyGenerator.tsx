
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { MicrophoneIcon } from './icons';

interface PolicyGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
}

interface GenerationResult {
  docxBlob: Blob;
  fileHash: string;
}

const PolicyGenerator: React.FC<PolicyGeneratorProps> = ({ isOpen, onClose, companyName }) => {
  const [policyName, setPolicyName] = useState('');
  const [frameworkRef, setFrameworkRef] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPolicyName, setGeneratedPolicyName] = useState('');
  const barcodeRef = useRef<SVGSVGElement>(null);
  const baseContentRef = useRef('');

  const handleTranscript = useCallback((transcript: string) => {
    setContent(baseContentRef.current + transcript);
  }, []);

  const handleFinalTranscript = useCallback((transcript: string) => {
    const newText = (baseContentRef.current + transcript.trim() + ' ').trim();
    baseContentRef.current = newText ? newText + ' ' : '';
    setContent(newText);
  }, []);

  const { isListening, toggleListening, isSupported } = useSpeechToText({
    onTranscript: handleTranscript,
    onFinalTranscript: handleFinalTranscript,
  });

  const handleDictationClick = () => {
    if (!isListening) {
        baseContentRef.current = content ? `${content} ` : '';
    }
    toggleListening();
  };

  const resetState = () => {
    setPolicyName('');
    setFrameworkRef('');
    setContent('');
    setResult(null);
    setIsLoading(false);
    setGeneratedPolicyName('');
    if (isListening) {
        toggleListening();
    }
  };
  
  const handleClose = () => {
    resetState();
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (result && generatedPolicyName && barcodeRef.current) {
        const JsBarcode = (window as any).JsBarcode;
        if (JsBarcode) {
            try {
                JsBarcode(barcodeRef.current, generatedPolicyName, {
                    format: "CODE128",
                    lineColor: "#06b6d4",
                    background: "transparent",
                    width: 2,
                    height: 50,
                    displayValue: true,
                    fontOptions: "bold",
                    font: "monospace",
                    fontSize: 14,
                    fontColor: "#e5e7eb",
                    margin: 10,
                });
            } catch (e) {
                console.error("Failed to generate barcode:", e);
            }
        }
    }
  }, [result, generatedPolicyName]);
  
  const handleGenerate = useCallback(async () => {
    if (!policyName || !content) {
      alert("Policy Name and Content are required.");
      return;
    }
    setIsLoading(true);
    setResult(null);
    setGeneratedPolicyName('');
    
    // Dynamically access libraries from window
    const docx = (window as any).docx;
    const JsBarcode = (window as any).JsBarcode;

    if (!docx || !JsBarcode) {
        alert("Required libraries (docx, jsbarcode) are not loaded.");
        setIsLoading(false);
        return;
    }

    try {
        const doc = new docx.Document({
            sections: [{
                children: [
                    new docx.Paragraph({ text: policyName, heading: docx.HeadingLevel.TITLE, alignment: docx.AlignmentType.CENTER }),
                    new docx.Paragraph({ text: '' }),
                    new docx.Paragraph({ text: `Company: ${companyName}` }),
                    new docx.Paragraph({ text: `Framework Reference: ${frameworkRef}` }),
                    new docx.Paragraph({ text: `Date: ${new Date().toISOString().split('T')[0]}` }),
                    new docx.Paragraph({ text: '' }),
                    new docx.Paragraph({ text: "Policy Content", heading: docx.HeadingLevel.HEADING_1 }),
                    ...content.split('\n').filter(p => p.trim() !== '').map(p => new docx.Paragraph({ text: p })),
                ],
            }],
        });

        const docxBlob = await docx.Packer.toBlob(doc);

        const buffer = await docxBlob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        setResult({ docxBlob, fileHash });
        setGeneratedPolicyName(policyName);

    } catch(error) {
        console.error("Failed to generate policy:", error);
        alert("An error occurred during policy generation.");
    } finally {
        setIsLoading(false);
    }
  }, [policyName, frameworkRef, content, companyName]);

  const handleDownload = () => {
    if (result) {
      const url = URL.createObjectURL(result.docxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyName.replace(/\s/g, '_')}_${generatedPolicyName.replace(/\s/g, '_')}.docx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  const InputField = ({ label, value, onChange, placeholder, type = 'text', children }: any) => (
    <div>
        <label className="block text-sm font-medium text-cyan-300 mb-1">{label}</label>
        <div className="relative">
        {type === 'textarea' ? (
            <textarea value={value} onChange={onChange} placeholder={placeholder} rows={8} className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
        ) : (
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-slate-900/50 border border-slate-600 rounded-md p-2 outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
        )}
        {children}
        </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" aria-labelledby="policy-generator-title" role="dialog" aria-modal="true" onClick={handleClose}>
        <div className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-lg shadow-2xl shadow-cyan-500/20 text-gray-200 transform transition-all" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                <h2 id="policy-generator-title" className="text-2xl font-bold text-cyan-500">Policy Generator</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-white transition">&times;</button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {!result && (
                  <div className="space-y-4">
                    <InputField label="Policy Name" value={policyName} onChange={(e: any) => setPolicyName(e.target.value)} placeholder="e.g., Access Control Policy" />
                    <InputField label="Framework Reference" value={frameworkRef} onChange={(e: any) => setFrameworkRef(e.target.value)} placeholder="e.g., ISO 27001 A.9.1.1" />
                    <InputField label="Content" value={content} onChange={(e: any) => setContent(e.target.value)} placeholder="Enter the main body of the policy..." type="textarea">
                        {isSupported && (
                            <button 
                                type="button" 
                                onClick={handleDictationClick} 
                                title="Dictate content"
                                className={`absolute right-2 top-2 p-1 rounded-full hover:bg-white/20 transition-colors ${isListening ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
                                <MicrophoneIcon className="h-4 w-4" />
                            </button>
                        )}
                    </InputField>
                  </div>
                )}
                {isLoading && <p className="text-center text-cyan-300">Generating Document...</p>}
                {result && (
                    <div className="space-y-6 text-center">
                        <h3 className="text-xl font-semibold text-cyan-300">Generation Complete!</h3>
                        <div>
                            <p className="font-semibold">Barcode for "{generatedPolicyName}":</p>
                            <svg ref={barcodeRef} className="mx-auto bg-gray-700/30 p-2 rounded-lg mt-2"></svg>
                        </div>
                        <div>
                            <p className="font-semibold">SHA-256 Hash:</p>
                            <p className="text-xs text-gray-400 font-mono break-all bg-gray-900/50 p-2 rounded-md mt-1">{result.fileHash}</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-6 border-t border-slate-700 flex justify-end gap-4">
                <button onClick={handleClose} className="px-4 py-2 bg-gray-600/30 hover:bg-gray-600/50 rounded-lg transition">Close</button>
                {result ? (
                    <button onClick={handleDownload} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition">Download .docx</button>
                ) : (
                    <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed">
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                )}
            </div>
        </div>
    </div>
  );
};

export default PolicyGenerator;
