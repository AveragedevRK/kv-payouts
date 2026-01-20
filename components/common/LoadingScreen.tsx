import React, { useState, useEffect } from 'react';

interface Props {
  onFinished: () => void;
}

export const LoadingScreen: React.FC<Props> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate initial asset loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onFinished, 400); // Smooth exit after reaching 100%
          return 100;
        }
        // Random increments to feel more organic
        const increment = Math.random() * 12 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinished]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#0a0a0a] flex flex-col items-center justify-center p-6 select-none overflow-hidden">
      {/* Logo Container with White Background */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_0_60px_rgba(255,255,255,0.2)] mb-10 transform animate-fade-in hover:scale-105 transition-transform duration-700">
        <img
          src="https://app.kambojventures.com/assets/images/logos/logo.png"
          alt="Kamboj Ventures"
          className="h-24 md:h-32 w-auto object-contain"
          draggable={false}
        />
      </div>

      {/* Progress Bar Container */}
      <div className="w-full max-w-[340px] flex flex-col items-center">
        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 mb-12">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF4D67] via-[#FF2D92] to-[#FF914D] shadow-[0_0_25px_rgba(255,45,146,0.8)] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Developer Credits - Ultra Flashy */}
        <div className="text-center animate-dev-entrance delay-300">
          <p className="text-[12px] md:text-sm theme-text-sub uppercase tracking-[0.4em] font-black opacity-90 leading-relaxed mb-4">
            Designed & Developed by
          </p>
          <div className="flex items-center justify-center gap-8 mt-2">
            <a 
              href="https://github.com/SalesGuyInTech" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl md:text-2xl font-black transition-all pb-1.5 tracking-[0.25em] uppercase text-flashy-shimmer animate-neon-underline"
            >
              GM
            </a>
            <span className="text-xl theme-text-sub opacity-30 font-black">&</span>
            <a 
              href="https://github.com/AveragedevRK/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xl md:text-2xl font-black transition-all pb-1.5 tracking-[0.25em] uppercase text-flashy-shimmer animate-neon-underline"
            >
              RAJAB
            </a>
          </div>
        </div>
      </div>

      {/* Subtle scanline effect for Carbon aesthetic */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};