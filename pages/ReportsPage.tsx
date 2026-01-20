import React from 'react';
import { useApp } from '../context/AppContext';
import { KPIHeader } from '../components/reports/KPIHeader';
import { ChartsGrid } from '../components/reports/ChartsGrid';

export const ReportsPage: React.FC = () => {
  const { accounts } = useApp();

  return (
    <div className="p-6 max-w-[1600px] mx-auto animate-fade-in">
      <h1 className="text-3xl font-light theme-text-main mb-8">Analytics Dashboard</h1>
      <KPIHeader accounts={accounts} />
      <ChartsGrid accounts={accounts} />
    </div>
  );
};