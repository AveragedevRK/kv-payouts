import React from 'react';

export const MobileExplorerCard: React.FC<{ item: any }> = ({ item }) => {
  return (
    <div className="theme-bg-card border theme-border rounded-lg p-4 shadow-sm animate-fade-in flex flex-col gap-2">
      <div className="flex justify-between items-start border-b theme-border pb-2">
        <div>
          <h4 className="font-bold theme-text-main text-base">{item.accountName}</h4>
          <span className="text-[10px] theme-text-sub uppercase">{item.date}</span>
        </div>
        <span className="text-[10px] theme-bg-page px-2 py-1 border theme-border rounded font-mono">
          Bank: ***{item.bankAccount}
        </span>
      </div>

      <div className="flex justify-between items-center py-2">
        <span className="theme-text-sub text-sm">Amount Received</span>
        <span className="text-lg font-bold text-[#FF2D92]">${item.payoutAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
      </div>

      <div className="text-[10px] theme-text-sub truncate">
        ID: {item.transferId}
      </div>
    </div>
  );
};