import React from 'react';
import { Payout } from '../../types';

export const PayoutExpanded: React.FC<{ payout: Payout }> = ({ payout }) => {
  const Row = ({ l, v }: { l: string, v: string }) => (
    <div className="flex justify-between py-1 border-b theme-border last:border-0">
      <span className="theme-text-sub text-sm">{l}</span>
      <span className="theme-text-main font-mono text-sm">{v}</span>
    </div>
  );

  return (
    <tr className="theme-bg-card animate-fade-in">
      <td colSpan={8} className="p-0">
        <div className="p-6 grid grid-cols-2 gap-12 border-b theme-border">
          <div>
            <h4 className="text-[#FF2D92] text-sm font-bold mb-3 uppercase">Fee Breakdown</h4>
            <Row l="Selling Fee" v={`$${payout.amazonFees.sellingFee}`} />
            <Row l="Fulfillment Fee" v={`$${payout.amazonFees.fulfillmentFee}`} />
            <Row l="Other Fees" v={`$${payout.amazonFees.otherFees}`} />
          </div>
          <div>
            <h4 className="text-green-500 text-sm font-bold mb-3 uppercase">Profitability</h4>
            <Row l="Net Profit" v={`$${payout.profit.toFixed(2)}`} />
            <Row l="Margin" v={`${((payout.profit / payout.revenue) * 100).toFixed(1)}%`} />
            <Row l="ROI" v={`${(payout.roi * 100).toFixed(1)}%`} />
          </div>
        </div>
      </td>
    </tr>
  );
};