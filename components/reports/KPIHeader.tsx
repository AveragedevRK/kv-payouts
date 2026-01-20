import React from 'react';
import { Account } from '../../types';

export const KPIHeader: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  const allPayouts = accounts.flatMap(a => a.payouts);
  const totalAmount = allPayouts.reduce((s, p) => s + p.payoutAmount, 0);
  const avgPayout = allPayouts.length ? totalAmount / allPayouts.length : 0;

  const Card = ({ label, val, sub }: any) => (
    <div className="theme-bg-card border theme-border p-6 md:p-10 lg:p-12 rounded shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-1 h-full bg-[#FF2D92] opacity-0 group-hover:opacity-100 transition-opacity" />
      <p className="text-[10px] md:text-sm theme-text-sub uppercase font-black tracking-[0.2em] md:tracking-[0.3em] mb-4 md:mb-6 opacity-40">{label}</p>
      <p className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black theme-text-main tracking-tighter leading-none">{val}</p>
      {sub && <p className="text-xs md:text-base theme-text-sub mt-4 md:mt-6 font-black uppercase tracking-widest opacity-80">{sub}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12 mb-12 md:mb-24">
      <Card label="VOLUME" val={`$${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="Lifetime Gross" />
      <Card label="ACCOUNTS" val={accounts.length} sub="Active Managed" />
      <Card label="AVERAGE" val={`$${avgPayout.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="Per Transfer" />
      <Card label="TRANSFERS" val={allPayouts.length} sub="Sync'd History" />
    </div>
  );
};