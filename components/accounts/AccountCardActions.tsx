import React, { useState } from 'react';
import { Account } from '../../types';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { ManageNotifsModal } from './ManageNotifsModal';
import { ArrowRight, Bell } from 'lucide-react';

export const AccountCardActions: React.FC<{ account: Account }> = ({ account }) => {
  const { selectAccount } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {account.notifiedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-1">
          {account.notifiedUsers.slice(0, 3).map(u => (
            <span key={u} className="text-[9px] theme-bg-hover theme-text-sub px-2 py-0.5 rounded border theme-border uppercase font-bold">
              {u.split('@')[0]}
            </span>
          ))}
          {account.notifiedUsers.length > 3 && (
            <span className="text-[9px] theme-text-sub font-bold">+{account.notifiedUsers.length - 3} MORE</span>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="secondary" onClick={() => setShowNotifs(true)} className="h-10 justify-center bg-white/[0.05] text-xs">
          <Bell size={14} className="opacity-70 mr-2" />
          <span>Alerts ({account.notifiedUsers.length})</span>
        </Button>
        <Button onClick={() => selectAccount(account.id)} className="h-10 text-xs font-bold" icon={<ArrowRight size={16} />}>
          View History
        </Button>
      </div>
      <ManageNotifsModal account={account} isOpen={showNotifs} onClose={() => setShowNotifs(false)} />
    </div>
  );
};