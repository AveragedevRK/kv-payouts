import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Account } from '../../types';

export const AddAccountModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addAccount } = useApp();
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Amazon');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: Account = {
      id: Date.now().toString(), name, platform,
      lastPayoutDate: '-', nextPayoutDate: '2023-11-01',
      notifiedUsers: [], payouts: []
    };
    addAccount(newAccount);
    setName('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Account">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs theme-text-sub mb-1">Account Name</label>
          <input className="w-full theme-bg-page border theme-border p-2 theme-text-main outline-none focus:border-[#FF2D92] rounded-sm"
            value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-xs theme-text-sub mb-1">Platform</label>
          <select className="w-full theme-bg-page border theme-border p-2 theme-text-main outline-none focus:border-[#FF2D92] rounded-sm"
            value={platform} onChange={e => setPlatform(e.target.value)}>
            <option>Amazon</option><option>Shopify</option><option>Walmart</option>
          </select>
        </div>
        <div className="pt-2 flex justify-end">
          <Button type="submit">Create Account</Button>
        </div>
      </form>
    </Modal>
  );
};