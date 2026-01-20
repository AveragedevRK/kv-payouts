import React from 'react';
import { User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { activeView } = useApp();
  const isSettings = activeView === 'SETTINGS';

  return (
    <header className="h-16 md:h-14 theme-bg-page border-b theme-border flex items-center px-4 justify-between sticky top-0 z-50 transition-colors backdrop-blur-md bg-opacity-90">
      <div className="flex items-center gap-3">
        <img 
          src="https://media.licdn.com/dms/image/v2/D560BAQGpvIgeR_f1pA/company-logo_200_200/company-logo_200_200/0/1736183276941?e=2147483647&t=MFB-6u61MJUdFeDrvH--MzXoUwG70XzvFvduHrDR8mU&v=beta" 
          alt="Kamboj Ventures" 
          className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border theme-border shadow-sm"
        />
        <div className="flex flex-col">
          <span className="font-black theme-text-main tracking-tighter text-sm md:text-base leading-none">PAYOUTS</span>
          <span className="text-[10px] theme-text-sub font-bold tracking-[0.2em] opacity-60">DASHBOARD</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {!isSettings && (
          <div 
            key={activeView} // Re-triggers animation on navigation
            className="hidden md:flex items-center gap-6 mr-4 animate-dev-entrance border-r theme-border pr-8"
          >
            <span className="text-[10px] theme-text-sub uppercase tracking-[0.25em] font-black opacity-90 whitespace-nowrap">
              Designed & Developed by
            </span>
            <div className="flex items-center gap-5">
              <a 
                href="https://github.com/SalesGuyInTech" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-black transition-all pb-0.5 tracking-[0.2em] uppercase text-flashy-shimmer animate-neon-underline"
              >
                GM
              </a>
              <span className="text-xs theme-text-sub opacity-40 font-black">&</span>
              <a 
                href="https://github.com/AveragedevRK/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-black transition-all pb-0.5 tracking-[0.2em] uppercase text-flashy-shimmer animate-neon-underline"
              >
                RAJAB
              </a>
            </div>
          </div>
        )}
        <div className="h-9 w-9 md:h-10 md:w-10 rounded-full theme-bg-hover flex items-center justify-center cursor-pointer transition-all border theme-border hover:border-[#FF2D92]/50 hover:shadow-[0_0_15px_rgba(255,45,146,0.3)]">
          <User size={18} className="theme-text-sub" />
        </div>
      </div>
    </header>
  );
};