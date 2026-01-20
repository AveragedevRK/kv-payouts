import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Account } from '../../types';
import { useApp } from '../../context/AppContext';
import { Trash2, Plus } from 'lucide-react';
import { Button } from '../common/Button';

export const ManageNotifsModal: React.FC<{ isOpen: boolean; onClose: () => void; account: Account }> = 
({ isOpen, onClose, account }) => {
  const { updateNotifs } = useApp();
  const [email, setEmail] = useState('');

  const add = () => {
    if (!email) return;
    updateNotifs(account.id, [...account.notifiedUsers, email]);
    setEmail('');
  };

  const remove = (target: string) => {
    updateNotifs(account.id, account.notifiedUsers.filter(e => e !== target));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Notifications: ${account.name}`}>
      <div className="mb-4 flex gap-2">
        <input className="flex-1 theme-bg-page border theme-border p-2 theme-text-main text-sm rounded-sm"
          placeholder="user@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <Button onClick={add} variant="secondary" className="w-10 justify-center px-0"><Plus size={16}/></Button>
      </div>
      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
        {account.notifiedUsers.map(u => (
          <div key={u} className="flex justify-between items-center theme-bg-card p-2 border theme-border rounded-sm">
            <span className="text-sm theme-text-sub">{u}</span>
            <button onClick={() => remove(u)} className="text-red-400 hover:text-red-300"><Trash2 size={14}/></button>
          </div>
        ))}
      </div>
    </Modal>
  );
};