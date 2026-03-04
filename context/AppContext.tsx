import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account, ViewState, Payout, AHMetrics } from '../types';
import { db } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
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
  updateHealthMetrics: (accId: string, metrics: Partial<AHMetrics>) => void;
  addAlertEmail: (accId: string, email: string) => void;
  removeAlertEmail: (accId: string, email: string) => void;
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

  // 1. Add New Account — initialize with empty payouts, healthMetrics, and notifiedUsers
  const addAccount = async (acc: Account) => {
    try {
      const newDoc: Account = {
        ...acc,
        payouts: [],
        healthMetrics: {} as AHMetrics,
        notifiedUsers: [],
      };
      await setDoc(doc(db, 'accounts', acc.id), newDoc);
    } catch (error) {
      console.error('[v0] Error adding account:', error);
    }
  };

  // 2. Add Payout To Account — append to payouts array without overwriting
  const addPayout = async (accId: string, payout: Payout) => {
    try {
      await updateDoc(doc(db, 'accounts', accId), {
        payouts: arrayUnion(payout),
      });
    } catch (error) {
      console.error('[v0] Error adding payout:', error);
    }
  };

  // 3. Update Health Metrics — merge into healthMetrics without removing other fields
  const updateHealthMetrics = async (accId: string, metrics: Partial<AHMetrics>) => {
    try {
      // Build a flat update map so Firestore merges individual fields
      const updates: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(metrics)) {
        updates[`healthMetrics.${key}`] = value;
      }
      await updateDoc(doc(db, 'accounts', accId), updates);
    } catch (error) {
      console.error('[v0] Error updating health metrics:', error);
    }
  };

  // 4. Add Alert Email — append to notifiedUsers using arrayUnion
  const addAlertEmail = async (accId: string, email: string) => {
    try {
      await updateDoc(doc(db, 'accounts', accId), {
        notifiedUsers: arrayUnion(email),
      });
    } catch (error) {
      console.error('[v0] Error adding alert email:', error);
    }
  };

  // 5. Remove Alert Email — remove from notifiedUsers using arrayRemove
  const removeAlertEmail = async (accId: string, email: string) => {
    try {
      await updateDoc(doc(db, 'accounts', accId), {
        notifiedUsers: arrayRemove(email),
      });
    } catch (error) {
      console.error('[v0] Error removing alert email:', error);
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
        updateHealthMetrics,
        addAlertEmail,
        removeAlertEmail,
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
