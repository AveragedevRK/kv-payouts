import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Account } from '../../types';

const COLORS = ['#FF4D67', '#FF2D92', '#FF914D', '#FF6A4D'];

export const ChartsGrid: React.FC<{ accounts: Account[] }> = ({ accounts }) => {
  // Sort account data by volume in descending order
  const accountData = accounts
    .map(a => ({
      name: a.name, 
      volume: a.payouts.reduce((s, p) => s + p.payoutAmount, 0)
    }))
    .sort((a, b) => b.volume - a.volume);
  
  // Simulated monthly volume for the line chart - Chronological order is maintained for time-series
  const timeData = [
    { name: 'Jan', val: 25000 }, { name: 'Feb', val: 32000 },
    { name: 'Mar', val: 58000 }, { name: 'Apr', val: 41000 },
    { name: 'May', val: 125000 }, { name: 'Jun', val: 110000 }
  ];

  const ChartBox = ({ title, children }: any) => (
    <div className="theme-bg-card border theme-border p-4 md:p-6 rounded-xl h-72 md:h-80 flex flex-col">
      <h3 className="theme-text-main font-semibold mb-4 text-sm">{title}</h3>
      <div className="flex-1 min-h-0 w-full">{children}</div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <ChartBox title="Volume by Account (Sorted Desc)">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={accountData}>
            <Bar dataKey="volume" fill="#FF2D92" radius={[4, 4, 0, 0]} />
            <XAxis dataKey="name" hide />
            <Tooltip 
              cursor={{fill: 'var(--bg-hover)'}}
              contentStyle={{background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '4px'}}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartBox>
      
      <ChartBox title="Total Payout Trend (Monthly History)">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeData}>
             <CartesianGrid stroke="var(--border-color)" vertical={false} strokeDasharray="3 3" />
             <XAxis dataKey="name" stroke="var(--text-sub)" fontSize={10} />
             <Line type="monotone" dataKey="val" stroke="#FF4D67" strokeWidth={3} dot={{fill: '#FF4D67', r: 4}} />
             <Tooltip 
                contentStyle={{background: 'var(--bg-card)', border: '1px solid var(--border-color)'}}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Monthly Total']}
             />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox title="Volume Distribution (Sorted Desc)">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={accountData} 
              dataKey="volume" 
              nameKey="name" 
              innerRadius={60} 
              outerRadius={80} 
              paddingAngle={5}
            >
              {accountData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip 
               formatter={(value: number) => [`$${value.toLocaleString()}`, 'Volume']}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartBox>
    </div>
  );
};