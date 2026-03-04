import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Account, Payout } from '../types';

const ACCOUNTS_COLLECTION = 'accounts';

/**
 * Subscribe to real-time updates on the accounts collection.
 * Each document is expected to contain the full Account object
 * including a `payouts` array field.
 *
 * Returns an unsubscribe function.
 */
export function subscribeToAccounts(
  onData: (accounts: Account[]) => void,
  onError: (err: Error) => void
): Unsubscribe {
  const accountsRef = collection(db, ACCOUNTS_COLLECTION);

  return onSnapshot(
    accountsRef,
    (snapshot) => {
      const accounts: Account[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        const payouts: Payout[] = (data.payouts || []).map((p: any) => ({
          id: p.id,
          date: p.date,
          payoutAmount: p.payoutAmount,
          transferId: p.transferId,
          bankAccount: p.bankAccount,
          ...(p.isNew !== undefined ? { isNew: p.isNew } : {}),
        }));

        // Sort payouts by date descending (MM/DD/YYYY format)
        payouts.sort((a, b) => {
          const da = new Date(a.date);
          const db2 = new Date(b.date);
          return db2.getTime() - da.getTime();
        });

        return {
          id: docSnap.id,
          name: data.name,
          platform: data.platform,
          lastPayoutDate: data.lastPayoutDate,
          nextPayoutDate: data.nextPayoutDate,
          notifiedUsers: data.notifiedUsers || [],
          healthMetrics: data.healthMetrics || undefined,
          payouts,
        };
      });

      onData(accounts);
    },
    (err) => {
      onError(err);
    }
  );
}

/**
 * Add a new account document to Firestore.
 */
export async function addAccountToFirestore(account: Account): Promise<void> {
  const accountDocRef = doc(db, ACCOUNTS_COLLECTION, account.id);
  await setDoc(accountDocRef, {
    name: account.name,
    platform: account.platform,
    lastPayoutDate: account.lastPayoutDate,
    nextPayoutDate: account.nextPayoutDate,
    notifiedUsers: account.notifiedUsers,
    ...(account.healthMetrics ? { healthMetrics: account.healthMetrics } : {}),
    payouts: account.payouts || [],
  });
}

/**
 * Add a payout to the account's payouts array and update lastPayoutDate.
 */
export async function addPayoutToFirestore(
  accountId: string,
  payout: Payout,
  currentPayouts: Payout[]
): Promise<void> {
  const accountDocRef = doc(db, ACCOUNTS_COLLECTION, accountId);
  const updatedPayouts = [payout, ...currentPayouts];
  await updateDoc(accountDocRef, {
    payouts: updatedPayouts,
    lastPayoutDate: payout.date,
  });
}

/**
 * Update notified users for an account.
 */
export async function updateNotifsInFirestore(
  accountId: string,
  emails: string[]
): Promise<void> {
  const accountDocRef = doc(db, ACCOUNTS_COLLECTION, accountId);
  await updateDoc(accountDocRef, { notifiedUsers: emails });
}
