import React from 'react';
import { useArt } from '../context/ArtContext';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts } = useArt();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 bg-[#1C1B1A] text-[#FAF8F5] px-4 py-3.5 rounded-xl shadow-xl border border-[#33312E] transition-all transform duration-300 animate-in fade-in slide-in-from-bottom-3"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#e7e2d7] shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#8B5E3C] shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
          <div className="text-sm font-medium leading-relaxed">{toast.message}</div>
        </div>
      ))}
    </div>
  );
};
