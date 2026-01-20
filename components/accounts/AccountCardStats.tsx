import React from 'react';
import { Account } from '../../types';

export const AccountCardStats: React.FC<{ account: Account }> = ({ account }) => {
  const lastPayout = account.payouts[0];
  const totalPayouts = account.payouts.reduce((sum, p) => sum + p.payoutAmount, 0);
  
  const Stat = ({ label, val, color = 'theme-text-main' }: { label: string, val: string, color?: string }) => (
    <div className="flex flex-col">
      <span className="text-[10px] theme-text-sub uppercase font-black tracking-[0.15em] mb-2 opacity-50">{label}</span>
      <span className={`text-2xl md:text-3xl font-black tracking-tighter ${color}`}>{val}</span>
    </div>
  );

  return (
    <div className="px-6 py-8 md:px-7 md:py-10 grid grid-cols-1 sm:grid-cols-2 gap-6 border-b theme-border bg-white/[0.01]">
      <Stat label="TOTAL VOLUME" val={`$${totalPayouts.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} color="text-[#FF2D92]" />
      <Stat label="LAST RECEIVED" val={`$${lastPayout?.payoutAmount.toLocaleString() || '0'}`} />
    </div>
  );
};