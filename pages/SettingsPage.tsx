import React from 'react';
import { Button } from '../components/common/Button';
import { Download, Moon, Sun, FileJson, FileSpreadsheet } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { accounts } = useApp();

  const handleExportCSV = () => {
    // Define headers
    const headers = ['Account Name', 'Platform', 'Payout Date', 'Amount ($)', 'Transfer ID', 'Bank Account'];
    
    // Flatten all payouts into a single array of rows
    const rows = accounts.flatMap(account => 
      account.payouts.map(payout => [
        account.name,
        account.platform,
        payout.date,
        payout.payoutAmount.toFixed(2),
        payout.transferId,
        `'***${payout.bankAccount}` // Prepend single quote to force string formatting in Excel
      ])
    );

    // Convert to CSV string with proper escaping
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `carbon_payouts_export_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(accounts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];

    link.setAttribute('href', url);
    link.setAttribute('download', `carbon_payouts_dump_${timestamp}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-light theme-text-main">Settings</h1>
      
      {/* Appearance Section */}
      <section className="theme-bg-card border theme-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b theme-border font-bold theme-text-main theme-bg-subtle text-xs uppercase tracking-widest opacity-70">
          Appearance
        </div>
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-medium theme-text-main">Interface Theme</h4>
            <p className="text-sm theme-text-sub">Toggle between light and dark visual modes</p>
          </div>
          <Button 
            onClick={toggleTheme} 
            variant="secondary" 
            className="w-full sm:w-auto min-w-[140px]"
            icon={theme === 'dark' ? <Moon size={14}/> : <Sun size={14}/>}
          >
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </Button>
        </div>
      </section>

      {/* Data Management Section */}
      <section className="theme-bg-card border theme-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b theme-border font-bold theme-text-main theme-bg-subtle text-xs uppercase tracking-widest opacity-70">
          Data Management
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <h4 className="font-medium theme-text-main">Export Payout Data</h4>
              <p className="text-sm theme-text-sub max-w-md">
                Generate a comprehensive report of all historical payouts across all managed accounts in CSV or JSON format.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button 
                onClick={handleExportJSON}
                variant="secondary"
                className="flex-1 sm:flex-none justify-center"
                icon={<FileJson size={14}/>}
              >
                Export JSON
              </Button>
              <Button 
                onClick={handleExportCSV}
                className="flex-1 sm:flex-none justify-center"
                icon={<FileSpreadsheet size={14}/>}
              >
                Export CSV
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <div className="text-center md:text-left pt-4">
        <p className="text-[10px] theme-text-sub uppercase tracking-[0.2em] opacity-40">
          Carbon Payouts Dashboard &bull; v1.2.0 &bull; Kamboj Ventures
        </p>
      </div>
    </div>
  );
};