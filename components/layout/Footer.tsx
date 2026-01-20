import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-16 px-6 border-t theme-border bg-black/40 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
        <p className="text-[11px] md:text-sm theme-text-sub uppercase tracking-[0.4em] font-black opacity-80 leading-relaxed mb-8">
          Designed & Developed by
        </p>
        <div className="flex items-center justify-center gap-10">
          <a 
            href="https://github.com/SalesGuyInTech" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-lg md:text-2xl font-black transition-all pb-1.5 tracking-[0.25em] uppercase text-flashy-shimmer animate-neon-underline"
          >
            GM
          </a>
          <span className="text-lg theme-text-sub opacity-30 font-black">&</span>
          <a 
            href="https://github.com/AveragedevRK/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-lg md:text-2xl font-black transition-all pb-1.5 tracking-[0.25em] uppercase text-flashy-shimmer animate-neon-underline"
          >
            RAJAB
          </a>
        </div>
        <div className="mt-16">
          <p className="text-[10px] theme-text-sub uppercase tracking-[0.3em] font-black opacity-20 hover:opacity-40 transition-opacity">
            Kamboj Ventures &bull; Payouts Dashboard &bull; v1.2.0
          </p>
        </div>
      </div>
    </footer>
  );
};