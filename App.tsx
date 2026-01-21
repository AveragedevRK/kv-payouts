import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/layout/Header';
import { TabNav } from './components/layout/TabNav';
import { AccountsPage } from './pages/AccountsPage';
import { PayoutsPage } from './pages/PayoutsPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AHReportsPage } from './pages/AHReportsPage';
import { BackgroundWatermark } from './components/layout/BackgroundWatermark';
import { LoadingScreen } from './components/common/LoadingScreen';
import { Footer } from './components/layout/Footer';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1 transition-colors duration-300">
      {activeView === 'ACCOUNTS' && <AccountsPage />}
      {activeView === 'PAYOUTS' && <PayoutsPage />}
      {activeView === 'REPORTS' && <ReportsPage />}
      {activeView === 'AH_REPORTS' && <AHReportsPage />}
      {activeView === 'SETTINGS' && <SettingsPage />}
    </main>
  );
};

const FooterWrapper: React.FC = () => {
  const { activeView } = useApp();
  // Show footer credits ONLY on the Settings page as requested
  if (activeView !== 'SETTINGS') return null;
  return <Footer />;
};

const AppCore: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen theme-bg-page theme-text-main font-sans transition-colors duration-300 relative isolation-auto selection:bg-[#FF2D92] selection:text-white">
      <BackgroundWatermark />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <TabNav />
        <MainContent />
        <FooterWrapper />
      </div>
      <style>{`
        @keyframes highlight { 0% { background: #FF2D9240; } 100% { background: transparent; } }
        .animate-highlight { animation: highlight 2s ease-out; }
        
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

        /* ULTRA FLASHY DEV CREDITS */
        @keyframes ultra-shimmer {
          0% { background-position: -200% center; text-shadow: 0 0 0px rgba(255,45,146,0); }
          50% { text-shadow: 0 0 15px rgba(255,45,146,0.8), 0 0 30px rgba(255,145,77,0.4); }
          100% { background-position: 200% center; text-shadow: 0 0 0px rgba(255,45,146,0); }
        }

        .text-flashy-shimmer {
          background: linear-gradient(
            90deg, 
            #ffffff 0%, 
            #FF2D92 20%, 
            #FF914D 40%, 
            #ffffff 50%, 
            #FF2D92 70%, 
            #FF914D 80%, 
            #ffffff 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: ultra-shimmer 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          display: inline-block;
          filter: drop-shadow(0 0 2px rgba(255,45,146,0.3));
        }

        @keyframes neon-underline-grow {
          0% { width: 0; opacity: 0; box-shadow: 0 0 0px transparent; }
          40% { width: 100%; opacity: 1; box-shadow: 0 0 20px #FF2D92; }
          100% { width: 100%; opacity: 1; box-shadow: 0 0 8px #FF2D92; }
        }

        .animate-neon-underline {
          position: relative;
        }

        .animate-neon-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          height: 3px;
          background: linear-gradient(90deg, #FF4D67, #FF2D92, #FF914D);
          animation: neon-underline-grow 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          border-radius: 4px;
        }

        @keyframes entrance-pulse {
          0% { transform: scale(0.9); opacity: 0; filter: brightness(2); }
          50% { transform: scale(1.1); opacity: 1; filter: brightness(1.5); }
          100% { transform: scale(1); opacity: 1; filter: brightness(1); }
        }

        .animate-dev-entrance {
          animation: entrance-pulse 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppCore />
      </AppProvider>
    </ThemeProvider>
  );
}
