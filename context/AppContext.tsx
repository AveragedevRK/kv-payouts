import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, ViewState, Payout } from '../types';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setView] = useState<ViewState>('ACCOUNTS');
  const [selectedAccountId, selectAccount] = useState<string | null>(null);

  // Real-time Firestore listener using onSnapshot
  useEffect(() => {
    console.log('[v0] Attaching onSnapshot listener to "accounts" collection...');

    const unsubscribe = onSnapshot(
      collection(db, 'accounts'),
      (snapshot) => {
        console.log('[v0] onSnapshot fired. Document count:', snapshot.size);

        if (snapshot.empty) {
          console.log('[v0] No accounts found in Firestore');
          setAccounts([]);
          setLoading(false);
          return;
        }

        const data: Account[] = snapshot.docs.map((d) => d.data() as Account);
        console.log('[v0] Mapped accounts:', JSON.stringify(data.map(a => ({ id: a.id, name: a.name }))));
        setAccounts(data);
        setLoading(false);
      },
      (error) => {
        console.error('[v0] Firestore onSnapshot error:', error);
        setLoading(false);
      }
    );

    return () => {
      console.log('[v0] Detaching onSnapshot listener');
      unsubscribe();
    };
  }, []);

  const addAccount = async (acc: Account) => {
    try {
      await setDoc(doc(db, 'accounts', acc.id), acc);
    } catch (error) {
      console.error('[v0] Error adding account:', error);
    }
  };

  const addPayout = async (accId: string, payout: Payout) => {
    try {
      await updateDoc(doc(db, 'accounts', accId), {
        payouts: arrayUnion(payout),
      });
    } catch (error) {
      console.error('[v0] Error adding payout:', error);
    }
  };

  const updateNotifs = async (accId: string, emails: string[]) => {
    try {
      await updateDoc(doc(db, 'accounts', accId), {
        notifiedUsers: emails,
      });
    } catch (error) {
      console.error('[v0] Error updating notifications:', error);
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
