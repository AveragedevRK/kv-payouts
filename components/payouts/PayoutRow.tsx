import React from 'react';
import { Payout } from '../../types';

export const PayoutRow: React.FC<{ payout: Payout }> = ({ payout }) => {
  return (
    <tr className={`border-b theme-border transition-colors hover:theme-bg-subtle ${payout.isNew ? 'animate-highlight' : ''}`}>
      <td className="p-6 theme-text-main font-black text-xl">{payout.date}</td>
      <td className="p-6 font-black text-[#FF2D92] text-3xl tracking-tighter">
        ${payout.payoutAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </td>
      <td className="p-6 font-mono theme-text-sub text-lg truncate max-w-[300px]" title={payout.transferId}>
        {payout.transferId}
      </td>
      <td className="p-6 text-right pr-12">
        <span className="text-lg font-mono theme-bg-page theme-text-sub px-5 py-2.5 border theme-border rounded shadow-md font-bold">
          ***{payout.bankAccount}
        </span>
      </td>
    </tr>
  );
};