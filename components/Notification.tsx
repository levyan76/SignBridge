
import React, { useEffect } from 'react';

export type NotificationType = 'error' | 'warning' | 'success' | 'info';

interface NotificationProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    success: 'fa-check-circle',
    info: 'fa-info-circle'
  };

  const colors = {
    error: 'bg-red-600 border-red-700 shadow-red-200',
    warning: 'bg-amber-500 border-amber-600 shadow-amber-200',
    success: 'bg-emerald-600 border-emerald-700 shadow-emerald-200',
    info: 'bg-blue-600 border-blue-700 shadow-blue-200'
  };

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-bold border-2 shadow-2xl animate-in slide-in-from-bottom-8 duration-300 ${colors[type]}`}>
      <i className={`fas ${icons[type]} text-lg`}></i>
      <div className="flex flex-col">
        <span className="text-sm">{message}</span>
        {type === 'error' && (
          <span className="text-[10px] opacity-80 uppercase tracking-tighter mt-0.5">Vérifiez votre connexion ou réessayez plus tard</span>
        )}
      </div>
      <button 
        onClick={onClose}
        className="ml-4 hover:opacity-70 transition-opacity"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Notification;
