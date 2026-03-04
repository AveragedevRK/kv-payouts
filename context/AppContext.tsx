import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, ViewState, Payout } from '../types';
import {
  subscribeToAccounts,
  addAccountToFirestore,
  addPayoutToFirestore,
  updateNotifsInFirestore,
} from '../lib/firestoreService';

interface AppContextType {
  accounts: Account[];
  activeView: ViewState;
  selectedAccountId: string | null;
  firestoreReady: boolean;
  setView: (view: ViewState) => void;
  selectAccount: (id: string | null) => void;
  addAccount: (acc: Account) => void;
  addPayout: (accId: string, payout: Payout) => void;
  updateNotifs: (accId: string, emails: string[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeView, setView] = useState<ViewState>('ACCOUNTS');
  const [selectedAccountId, selectAccount] = useState<string | null>(null);
  const [firestoreReady, setFirestoreReady] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToAccounts(
      (data) => {
        setAccounts(data);
        setFirestoreReady(true);
      },
      (err) => {
        console.error('Firestore subscription error:', err);
        setFirestoreReady(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const addAccount = async (acc: Account) => {
    try {
      await addAccountToFirestore(acc);
      // Real-time listener will update state automatically
    } catch (err) {
      console.error('Failed to add account:', err);
    }
  };

  const addPayout = async (accId: string, payout: Payout) => {
    try {
      const account = accounts.find((a) => a.id === accId);
      await addPayoutToFirestore(accId, payout, account?.payouts || []);
      // Real-time listener will update state automatically
    } catch (err) {
      console.error('Failed to add payout:', err);
    }
  };

  const updateNotifs = async (accId: string, emails: string[]) => {
    try {
      await updateNotifsInFirestore(accId, emails);
      // Real-time listener will update state automatically
    } catch (err) {
      console.error('Failed to update notifications:', err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        accounts,
        activeView,
        selectedAccountId,
        firestoreReady,
        setView,
        selectAccount,
        addAccount,
        addPayout,
        updateNotifs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
