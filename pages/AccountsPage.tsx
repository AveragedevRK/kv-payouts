import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AccountCard } from '../components/accounts/AccountCard';
import { Button } from '../components/common/Button';
import { Plus } from 'lucide-react';
import { AddAccountModal } from '../components/accounts/AddAccountModal';
import { AccountDetailView } from '../components/accounts/AccountDetailView';

export const AccountsPage: React.FC = () => {
  const { accounts, selectedAccountId } = useApp();
  const [isAddOpen, setAddOpen] = useState(false);

  if (selectedAccountId) {
    return <AccountDetailView accountId={selectedAccountId} />;
  }

  return (
    <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-light theme-text-main tracking-tight">Accounts</h1>
        <Button onClick={() => setAddOpen(true)} icon={<Plus size={18} />} className="h-11 px-5">
          <span className="hidden sm:inline text-sm">Add New Account</span>
          <span className="sm:hidden text-sm">Add</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {accounts.map(acc => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>
      
      <AddAccountModal isOpen={isAddOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};