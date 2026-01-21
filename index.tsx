import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import * as Lucide from 'lucide-react';
import * as Recharts from 'recharts';

// Price per item helper based on your instructions (Total / 1)
const calculateUnitPrice = (total: string) => {
  const num = parseFloat(total.replace(/[^0-9.]/g, ''));
  return (num / 1).toFixed(2);
};

const PAYOUT_DATA = [
  { month: 'Jan', amount: 4500 },
  { month: 'Feb', amount: 5200 },
  { month: 'Mar', amount: 4800 },
  { month: 'Apr', amount: 6100 },
  { month: 'May', amount: 5900 },
  { month: 'Jun', amount: 7200 },
];

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen theme-bg-page" data-theme="dark">
      {children}
    </div>
  );
};

const Dashboard = () => (
  <div className="p-4 md:p-8 max-w-7xl mx-auto animate-fade-in">
    <header className="mb-8">
      <h1 className="text-3xl font-bold theme-text-main flex items-center gap-2">
        <Lucide.Leaf className="theme-accent" /> Carbon Payouts
      </h1>
      <p className="theme-text-sub">Environmental Asset Management</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { label: 'Total Payout', value: '$33,700', icon: Lucide.DollarSign },
        { label: 'Active Credits', value: '940.5', icon: Lucide.TrendingUp },
        { label: 'Net Impact', value: '1,200 Tons', icon: Lucide.Leaf },
      ].map((stat, i) => (
        <div key={i} className="theme-bg-card p-6 rounded-2xl border theme-border">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-[#FF2D9220]">
              <stat.icon className="theme-accent" size={24} />
            </div>
            <span className="text-green-500 text-sm font-medium flex items-center gap-1">
              +12% <Lucide.ArrowUpRight size={14} />
            </span>
          </div>
          <h3 className="theme-text-sub text-sm font-medium">{stat.label}</h3>
          <p className="text-2xl font-bold theme-text-main mt-1">{stat.value}</p>
          <p className="text-[11px] theme-text-sub mt-2 opacity-70">
            Unit Price: ${calculateUnitPrice(stat.value)} / unit
          </p>
        </div>
      ))}
    </div>

    <div className="theme-bg-card p-6 rounded-2xl border theme-border">
      <h3 className="theme-text-main font-bold mb-6">Revenue Growth</h3>
      <div className="h-[300px] w-full">
        <Recharts.ResponsiveContainer width="100%" height="100%">
          <Recharts.AreaChart data={PAYOUT_DATA}>
            <defs>
              <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF2D92" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF2D92" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Recharts.CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <Recharts.XAxis dataKey="month" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={false} />
            <Recharts.YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={false} />
            <Recharts.Tooltip 
              contentStyle={{ backgroundColor: '#161616', border: '1px solid #333', borderRadius: '8px' }}
              itemStyle={{ color: '#FF2D92' }}
            />
            <Recharts.Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#FF2D92" 
              fillOpacity={1} 
              fill="url(#colorAmt)" 
              strokeWidth={3} 
            />
          </Recharts.AreaChart>
        </Recharts.ResponsiveContainer>
      </div>
    </div>
  </div>
);

const App = () => (
  <AppProvider>
    <Dashboard />
  </AppProvider>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
