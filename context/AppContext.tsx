import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, ViewState, Payout } from '../types';
import {
  forceSeed,
  seedIfEmpty,
  fetchAllAccounts,
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
    let cancelled = false;
    async function init() {
      try {
        // Force seed: clear and push all mock data to Firestore first
        await forceSeed();
        // Fetch all accounts from Firestore
        const data = await fetchAllAccounts();
        if (!cancelled) {
          setAccounts(data);
          setFirestoreReady(true);
        }
      } catch (err) {
        console.error('Firestore init failed:', err);
        if (!cancelled) {
          setFirestoreReady(true);
        }
      }
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const addAccount = async (acc: Account) => {
    try {
      await addAccountToFirestore(acc);
      setAccounts(p => [...p, acc]);
    } catch (err) {
      console.error('Failed to add account:', err);
    }
  };

  const addPayout = async (accId: string, payout: Payout) => {
    try {
      await addPayoutToFirestore(accId, payout);
      setAccounts(prev =>
        prev.map(a =>
          a.id === accId ? { ...a, payouts: [payout, ...a.payouts], lastPayoutDate: payout.date } : a
        )
      );
    } catch (err) {
      console.error('Failed to add payout:', err);
    }
  };

  const updateNotifs = async (accId: string, emails: string[]) => {
    try {
      await updateNotifsInFirestore(accId, emails);
      setAccounts(prev =>
        prev.map(a => (a.id === accId ? { ...a, notifiedUsers: emails } : a))
      );
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
