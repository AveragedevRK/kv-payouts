import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Account, ViewState, Payout } from '../types';
import { INITIAL_ACCOUNTS } from '../data/mockData';

interface AppContextType {
  accounts: Account[];
  activeView: ViewState;
  selectedAccountId: string | null;
  setView: (view: ViewState) => void;
  selectAccount: (id: string | null) => void;
  addAccount: (acc: Account) => void;
  addPayout: (accId: string, payout: Payout) => void;
  updateNotifs: (accId: string, emails: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [activeView, setView] = useState<ViewState>('ACCOUNTS');
  const [selectedAccountId, selectAccount] = useState<string | null>(null);

  const addAccount = (acc: Account) => setAccounts(p => [...p, acc]);
  
  const addPayout = (accId: string, payout: Payout) => {
    setAccounts(prev => prev.map(a => a.id === accId ? 
      { ...a, payouts: [payout, ...a.payouts] } : a
    ));
  };

  const updateNotifs = (accId: string, emails: string[]) => {
    setAccounts(prev => prev.map(a => a.id === accId ? { ...a, notifiedUsers: emails } : a));
  };

  return (
    <AppContext.Provider value={{ 
      accounts, activeView, selectedAccountId, setView, selectAccount, 
      addAccount, addPayout, updateNotifs 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};