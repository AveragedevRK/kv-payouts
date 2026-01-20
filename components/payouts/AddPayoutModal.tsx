import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Payout } from '../../types';

interface Props { isOpen: boolean; onClose: () => void; accountId: string }

export const AddPayoutModal: React.FC<Props> = ({ isOpen, onClose, accountId }) => {
  const { addPayout } = useApp();
  const [amount, setAmount] = useState('0');
  const [tid, setTid] = useState('');
  const [bank, setBank] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Payout = {
      id: Date.now().toString(),
      date,
      payoutAmount: Number(amount),
      transferId: tid || 'MANUAL-' + Date.now().toString().slice(-4),
      bankAccount: bank || '000',
      isNew: true
    };
    addPayout(accountId, p);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Manual Payout">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm" />
          </div>
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">Amount Received ($)</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm text-lg font-bold" />
          </div>
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">Transfer ID</label>
            <input type="text" value={tid} onChange={e => setTid(e.target.value)} placeholder="e.g. 478URWO..." className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm font-mono" />
          </div>
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">Bank Account (Last 3-4 digits)</label>
            <input type="text" value={bank} onChange={e => setBank(e.target.value)} placeholder="268" className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm" />
          </div>
        </div>
        <Button type="submit" className="mt-4">Save Entry</Button>
      </form>
    </Modal>
  );
};