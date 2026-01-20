import React from 'react';
import { Payout } from '../../types';

export const MobilePayoutCard: React.FC<{ payout: Payout }> = ({ payout }) => {
  return (
    <div className="theme-bg-card border theme-border rounded-xl p-5 shadow-md animate-fade-in flex flex-col gap-3">
      <div className="flex justify-between items-center border-b theme-border pb-3 mb-1">
        <div className="text-sm theme-text-sub uppercase tracking-widest font-bold">{payout.date}</div>
        <div className="text-xs font-mono theme-bg-page px-2 py-1 rounded border theme-border">Bank: ***{payout.bankAccount}</div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm theme-text-sub font-medium">Received</span>
        <span className="text-2xl font-black text-[#FF2D92] tracking-tight">
          ${payout.payoutAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="pt-2 flex flex-col gap-1">
        <span className="text-[10px] theme-text-sub uppercase font-bold tracking-widest">Transfer ID</span>
        <span className="text-sm font-mono theme-text-main bg-black/20 p-2 rounded truncate border border-white/5">
          {payout.transferId}
        </span>
      </div>
    </div>
  );
};