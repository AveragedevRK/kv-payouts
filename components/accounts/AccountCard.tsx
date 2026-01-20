import React from 'react';
import { Account } from '../../types';
import { AccountCardActions } from './AccountCardActions';
import { AccountCardStats } from './AccountCardStats';

export const AccountCard: React.FC<{ account: Account }> = ({ account }) => {
  return (
    <div className="theme-bg-card border theme-border rounded-lg overflow-hidden shadow-xl hover:border-[#FF2D92]/80 transition-all flex flex-col group h-full">
      <div className="p-6 md:p-7 border-b theme-border bg-white/[0.03]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-2xl md:text-3xl font-black theme-text-main truncate group-hover:theme-accent transition-colors tracking-tighter">
            {account.name}
          </h3>
          <span className="text-[10px] font-black theme-bg-hover px-2.5 py-1 rounded border theme-border uppercase tracking-[0.15em] opacity-80 whitespace-nowrap">
            {account.platform}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] font-black theme-text-sub uppercase tracking-widest opacity-60">NEXT SYNC</span>
          <span className="text-base md:text-lg font-mono font-black text-[#FF2D92]">{account.nextPayoutDate}</span>
        </div>
      </div>

      <AccountCardStats account={account} />
      
      <div className="p-6 mt-auto bg-black/5">
        <AccountCardActions account={account} />
      </div>
    </div>
  );
};