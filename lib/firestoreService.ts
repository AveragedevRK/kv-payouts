import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { Account, Payout } from '../types';
import { INITIAL_ACCOUNTS } from '../data/mockData';

const ACCOUNTS_COLLECTION = 'accounts';
const PAYOUTS_SUBCOLLECTION = 'payouts';

/**
 * Delete all documents in the accounts collection including subcollections.
 */
async function clearAllAccounts(): Promise<void> {
  const accountsRef = collection(db, ACCOUNTS_COLLECTION);
  const snapshot = await getDocs(accountsRef);

  for (const accountDoc of snapshot.docs) {
    // Delete all payouts in subcollection first
    const payoutsRef = collection(
      db,
      ACCOUNTS_COLLECTION,
      accountDoc.id,
      PAYOUTS_SUBCOLLECTION
    );
    const payoutsSnap = await getDocs(payoutsRef);
    for (const payoutDoc of payoutsSnap.docs) {
      await deleteDoc(
        doc(db, ACCOUNTS_COLLECTION, accountDoc.id, PAYOUTS_SUBCOLLECTION, payoutDoc.id)
      );
    }
    // Delete the account doc
    await deleteDoc(doc(db, ACCOUNTS_COLLECTION, accountDoc.id));
  }
}

/**
 * Write all INITIAL_ACCOUNTS to Firestore using batched writes.
 */
async function writeAllAccounts(): Promise<void> {
  const MAX_BATCH_OPS = 450;
  let batch = writeBatch(db);
  let opCount = 0;

  for (const account of INITIAL_ACCOUNTS) {
    const accountDocRef = doc(db, ACCOUNTS_COLLECTION, account.id);

    // Write account document (without payouts - those go to subcollection)
    const { payouts, ...accountData } = account;
    batch.set(accountDocRef, accountData);
    opCount++;

    if (opCount >= MAX_BATCH_OPS) {
      await batch.commit();
      batch = writeBatch(db);
      opCount = 0;
    }

    // Write each payout as a subcollection document
    for (const payout of payouts) {
      const payoutDocRef = doc(
        db,
        ACCOUNTS_COLLECTION,
        account.id,
        PAYOUTS_SUBCOLLECTION,
        payout.id
      );
      batch.set(payoutDocRef, payout);
      opCount++;

      if (opCount >= MAX_BATCH_OPS) {
        await batch.commit();
        batch = writeBatch(db);
        opCount = 0;
      }
    }
  }

  // Commit remaining operations
  if (opCount > 0) {
    await batch.commit();
  }
}

/**
 * Force seed: clears ALL existing data and re-seeds from mockData.
 */
export async function forceSeed(): Promise<void> {
  console.log('Force seeding: clearing existing data...');
  await clearAllAccounts();
  console.log('Existing data cleared. Writing mock data...');
  await writeAllAccounts();
  console.log('Force seed complete!');
}

/**
 * Seed Firestore with hardcoded data if accounts collection is empty.
 */
export async function seedIfEmpty(): Promise<void> {
  const accountsRef = collection(db, ACCOUNTS_COLLECTION);
  const snapshot = await getDocs(accountsRef);

  if (!snapshot.empty) {
    return; // Already seeded
  }

  await writeAllAccounts();
}

/**
 * Fetch all accounts with their payouts subcollections merged.
 */
export async function fetchAllAccounts(): Promise<Account[]> {
  const accountsRef = collection(db, ACCOUNTS_COLLECTION);
  const accountsSnap = await getDocs(accountsRef);

  const accounts: Account[] = [];

  for (const accountDoc of accountsSnap.docs) {
    const data = accountDoc.data();
    const payoutsRef = collection(
      db,
      ACCOUNTS_COLLECTION,
      accountDoc.id,
      PAYOUTS_SUBCOLLECTION
    );
    const payoutsSnap = await getDocs(payoutsRef);

    const payouts: Payout[] = payoutsSnap.docs.map((d) => d.data() as Payout);

    // Sort payouts by date descending (MM/DD/YYYY format)
    payouts.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return db.getTime() - da.getTime();
    });

    accounts.push({
      id: accountDoc.id,
      name: data.name,
      platform: data.platform,
      lastPayoutDate: data.lastPayoutDate,
      nextPayoutDate: data.nextPayoutDate,
      notifiedUsers: data.notifiedUsers || [],
      healthMetrics: data.healthMetrics || undefined,
      payouts,
    });
  }

  return accounts;
}

/**
 * Add a new account document to Firestore.
 */
export async function addAccountToFirestore(account: Account): Promise<void> {
  const { payouts, ...accountData } = account;
  const accountDocRef = doc(db, ACCOUNTS_COLLECTION, account.id);
  await setDoc(accountDocRef, accountData);
}

/**
 * Add a payout to the payouts subcollection of an account.
 * Also updates the account's lastPayoutDate.
 */
export async function addPayoutToFirestore(
  accountId: string,
  payout: Payout
): Promise<void> {
  const payoutDocRef = doc(
    db,
    ACCOUNTS_COLLECTION,
    accountId,
    PAYOUTS_SUBCOLLECTION,
    payout.id
  );
  await setDoc(payoutDocRef, payout);

  // Update lastPayoutDate on the account
  const accountDocRef = doc(db, ACCOUNTS_COLLECTION, accountId);
  await updateDoc(accountDocRef, {
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
