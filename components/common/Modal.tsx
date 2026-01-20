import React from 'react';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity p-0 sm:p-4">
      <div className="theme-bg-card w-full max-w-md border-t sm:border theme-border shadow-2xl animate-fade-in relative rounded-t-xl sm:rounded-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b theme-border bg-[var(--bg-hover)] shrink-0">
          <h3 className="theme-text-main font-semibold truncate pr-4">{title}</h3>
          <button onClick={onClose} className="theme-text-sub hover:theme-text-main p-2 rounded-full hover:bg-white/5 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 md:p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};