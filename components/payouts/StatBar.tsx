import React from 'react';
import { Payout } from '../../types';

export const StatBar: React.FC<{ payouts: Payout[]; nextDate: string }> = ({ payouts, nextDate }) => {
  const totalAmount = payouts.reduce((sum, p) => sum + p.payoutAmount, 0);

  const Card = ({ label, val, color = 'theme-text-main' }: { label: string, val: string, color?: string }) => (
    <div className="theme-bg-card border theme-border p-5 md:p-8 flex flex-col justify-center rounded shadow-lg border-b-4 border-b-[#FF2D92]/50">
      <span className="text-[10px] md:text-sm theme-text-sub uppercase font-black tracking-widest mb-2 md:mb-3 opacity-70">{label}</span>
      <span className={`text-2xl md:text-5xl font-black tracking-tighter truncate ${color}`}>{val}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
      <div className="sm:col-span-2 lg:col-span-1">
        <Card label="Total Received" val={`$${totalAmount.toLocaleString()}`} color="theme-accent" />
      </div>
      <Card label="Count" val={`${payouts.length}`} />
      <Card label="Next Expected" val={nextDate} />
    </div>
  );
};