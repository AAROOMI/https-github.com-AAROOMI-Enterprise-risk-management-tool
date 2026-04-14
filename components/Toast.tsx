import React, { useEffect } from 'react';
import { ShieldCheckIcon } from './icons'; // Using an icon for visual feedback

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 bg-green-600/80 backdrop-blur-sm text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-4 animate-pulse"
      style={{ animation: 'fade-in-out 5s forwards' }}
      role="alert"
    >
      <ShieldCheckIcon className="h-6 w-6 text-white flex-shrink-0" />
      <p className="text-sm font-semibold">{message}</p>
      <button
        onClick={onClose}
        className="text-lg font-bold text-green-100 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        &times;
      </button>
      <style>{`
        @keyframes fade-in-out {
          0% { opacity: 0; transform: translateY(20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
};

export default Toast;
