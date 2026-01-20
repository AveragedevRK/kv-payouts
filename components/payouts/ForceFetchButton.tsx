import React, { useState } from 'react';
import { Button } from '../common/Button';
import { RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Payout } from '../../types';

export const ForceFetchButton: React.FC<{ accountId: string }> = ({ accountId }) => {
  const { addPayout } = useApp();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleFetch = () => {
    setLoading(true);
    setMsg('');
    
    setTimeout(() => {
      const p: Payout = {
        id: `fetched_${Date.now()}`, 
        date: new Date().toISOString().split('T')[0],
        payoutAmount: 12540.80,
        transferId: 'AUTO-' + Math.random().toString(36).substring(7).toUpperCase(),
        bankAccount: '268',
        isNew: true
      };
      addPayout(accountId, p);
      setLoading(false);
      setMsg('1 transfer sync\'d.');
      setTimeout(() => setMsg(''), 3000);
    }, 1200);
  };

  return (
    <div className="flex items-center gap-3">
      {msg && <span className="text-xs text-green-500 animate-fade-in">{msg}</span>}
      <Button onClick={handleFetch} variant="secondary" disabled={loading} icon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}>
        {loading ? 'Syncing...' : 'Force Sync'}
      </Button>
    </div>
  );
};