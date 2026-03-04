import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Account, ViewState, Payout } from '../types';
import { db } from '../lib/firebase';
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';

interface AppContextType {
  accounts: Account[];
  loading: boolean;
  activeView: ViewState;
  selectedAccountId: string | null;
  setView: (view: ViewState) => void;
  selectAccount: (id: string | null) => void;
  addAccount: (acc: Account) => void;
  addPayout: (accId: string, payout: Payout) => void;
  updateNotifs: (accId: string, emails: string[]) => void;
  refreshAccounts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setView] = useState<ViewState>('ACCOUNTS');
  const [selectedAccountId, selectAccount] = useState<string | null>(null);

  // Fetch accounts from Firestore
  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'accounts'));
      const data: Account[] = snapshot.docs.map((d) => ({
        ...d.data(),
        id: d.id,
      })) as Account[];
      setAccounts(data);
    } catch (error) {
      console.error('Firestore fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on every mount (every app load)
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const addAccount = async (acc: Account) => {
    try {
      await setDoc(doc(db, 'accounts', acc.id), acc);
      await fetchAccounts();
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const addPayout = async (accId: string, payout: Payout) => {
    try {
      await updateDoc(doc(db, 'accounts', accId), {
        payouts: arrayUnion(payout),
      });
      await fetchAccounts();
    } catch (error) {
      console.error('Error adding payout:', error);
    }
  };

  const updateNotifs = async (accId: string, emails: string[]) => {
    try {
      await updateDoc(doc(db, 'accounts', accId), {
        notifiedUsers: emails,
      });
      await fetchAccounts();
    } catch (error) {
      console.error('Error updating notifications:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        accounts,
        loading,
        activeView,
        selectedAccountId,
        setView,
        selectAccount,
        addAccount,
        addPayout,
        updateNotifs,
        refreshAccounts: fetchAccounts,
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
