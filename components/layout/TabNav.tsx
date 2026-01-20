
import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewState } from '../../types';

export const TabNav: React.FC = () => {
  const { activeView, setView } = useApp();

  const Tab = ({ view, label }: { view: ViewState; label: string }) => {
    const isActive = activeView === view;
    return (
      <button
        onClick={() => setView(view)}
        className={`
          h-12 px-4 md:px-6 text-sm font-medium transition-colors relative whitespace-nowrap
          ${isActive ? 'theme-text-main' : 'theme-text-sub hover:theme-text-main'}
        `}
      >
        {label}
        {isActive && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#FF4D67] via-[#FF2D92] to-[#FF914D]" />
        )}
      </button>
    );
  };

  return (
    <div className="theme-bg-page border-b theme-border w-full flex px-2 md:px-4 transition-colors overflow-x-auto no-scrollbar">
      <Tab view="ACCOUNTS" label="Accounts" />
      <Tab view="PAYOUTS" label="Explorer" />
      <Tab view="REPORTS" label="Reports" />
      <Tab view="AH_REPORTS" label="AH Reports" />
      <Tab view="SETTINGS" label="Settings" />
    </div>
  );
};
