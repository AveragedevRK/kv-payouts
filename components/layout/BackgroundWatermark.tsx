import React from 'react';

export const BackgroundWatermark: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      <img
        src="https://app.kambojventures.com/assets/images/logos/logo.png"
        alt=""
        className="w-auto h-auto max-w-[60vw] max-h-[60vh] object-contain transition-all duration-1000 ease-in-out"
        style={{ 
          opacity: 0.4, 
          filter: 'blur(8px) grayscale(100%) brightness(1.2)',
          transform: 'translateZ(0) scale(1.1)' 
        }} 
      />
    </div>
  );
};