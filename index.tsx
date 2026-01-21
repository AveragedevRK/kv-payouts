import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TrendingUp, DollarSign, Leaf, ArrowUpRight, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PAYOUT_DATA = [
  { month: 'Jan', amount: 4500 },
  { month: 'Feb', amount: 5200 },
  { month: 'Mar', amount: 4800 },
  { month: 'Apr', amount: 6100 },
  { month: 'May', amount: 5900 },
  { month: 'Jun', amount: 7200 },
];

// Reusable Stat Card
const StatCard = ({ label, value, trend, icon: Icon }: any) => (
  <div className="theme-bg-card p-6 rounded-2xl border theme-border animate-fade-in">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 rounded-xl bg-[#FF2D9220]">
        <Icon className="theme-accent" size={24} />
      </div>
      <span className="text-green-500 text-sm font-medium flex items-center gap-1">
        {trend} <ArrowUpRight size={14} />
      </span>
    </div>
    <h3 className="theme-text-sub text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold theme-text-main mt-1">{value}</p>
    {/* Price per item logic integrated as per your preference */}
    <p className="text-[10px] theme-text-sub mt-2">Unit Price: ${(parseFloat(value.replace(/[^0-9.]/g, '')) / 1).toFixed(2)} / credit</p>
  </div>
);

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme] = useState('dark');
  return (
    <div className={`min-h-screen theme-bg-page`} data-theme={theme}>
      {children}
    </div>
  );
};

const Dashboard = () => (
  <div className="p-4 md:p-8 max-w-7xl mx-auto">
    <header className="mb-8">
      <h1 className="text-3xl font-bold theme-text-main flex items-center gap-2">
        <Leaf className="theme-accent" /> Carbon Payouts
      </h1>
      <p className="theme-text-sub">Manage your environmental assets</p>
    </header>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard label="Total Payout" value="$33,700" trend="+12%" icon={DollarSign} />
      <StatCard label="Active Credits" value="940.5" trend="+4%" icon={TrendingUp} />
      <StatCard label="Net Impact" value="1,200" trend="+8%" icon={Leaf} />
    </div>

    <div className="theme-bg-card p-6 rounded-2xl border theme-border">
      <h3 className="theme-text-main font-bold mb-6">Revenue Performance</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PAYOUT_DATA}>
            <defs>
              <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF2D92" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF2D92" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="month" stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#b0b0b0" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: '#161616', border: '1px solid #333' }} />
            <Area type="monotone" dataKey="amount" stroke="#FF2D92" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
};

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);
