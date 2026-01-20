
import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, AlertTriangle, CheckCircle, Shield, ShieldAlert, Package, ThumbsUp, Truck } from 'lucide-react';
import { AHMetrics, Account } from '../types';

const getStatus = (val: number, type: keyof AHMetrics) => {
  switch (type) {
    case 'ahr': return val >= 200 ? 'good' : 'bad';
    case 'otdr': return val >= 90 ? 'good' : 'bad';
    case 'vtr': return val >= 90 ? 'good' : 'bad';
    case 'lsr': return val < 4 ? 'good' : 'bad';
    case 'pfcr': return val < 2.5 ? 'good' : 'bad';
    case 'odr': return val < 1 ? 'good' : 'bad';
    default: return 'neutral';
  }
};

const MetricItem = ({ label, val, type, suffix = '%' }: { label: string, val: number | undefined, type: keyof AHMetrics, suffix?: string }) => {
  if (val === undefined) return (
    <div className="flex flex-col bg-black/20 p-3 rounded border theme-border">
      <span className="text-[10px] theme-text-sub uppercase font-bold opacity-50">{label}</span>
      <span className="text-lg font-mono theme-text-sub opacity-30">-</span>
    </div>
  );

  const status = getStatus(val, type);
  const color = status === 'good' ? 'text-green-500' : 'text-red-500';
  const bg = status === 'good' ? 'bg-green-500/5 border-green-500/10' : 'bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]';

  return (
    <div className={`flex flex-col p-3 rounded border ${bg} transition-all`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] theme-text-sub uppercase font-bold tracking-wider opacity-70">{label}</span>
        {status === 'bad' && <AlertTriangle size={10} className="text-red-500 animate-pulse" />}
      </div>
      <span className={`text-xl font-black tracking-tight ${color}`}>
        {val}{suffix}
      </span>
    </div>
  );
};

const AccountHealthCard = ({ account }: { account: Account }) => {
  const m = account.healthMetrics;
  const isHealthy = m ? m.ahr >= 200 : true; // Default to healthy if no data for visual consistency, or handle empty state
  const statusColor = isHealthy ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500';

  return (
    <div className={`theme-bg-card border theme-border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col ${statusColor}`}>
      {/* Header */}
      <div className="p-5 border-b theme-border bg-white/[0.02] flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold theme-text-main leading-none mb-1">{account.name}</h3>
          <span className="text-[10px] theme-text-sub uppercase tracking-widest font-bold opacity-60 flex items-center gap-1">
            {account.platform} <span className="w-1 h-1 rounded-full bg-white/20 mx-1" /> ID: {account.id}
          </span>
        </div>
        {m ? (
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isHealthy ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
             {isHealthy ? <Shield size={14} /> : <ShieldAlert size={14} />}
             <span className="text-xs font-black uppercase tracking-wider">{isHealthy ? 'HEALTHY' : 'AT RISK'}</span>
           </div>
        ) : (
          <div className="px-3 py-1.5 rounded-full border theme-border bg-white/5 text-xs theme-text-sub">
            No Data
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-6">
        {/* AHR Hero */}
        <div className="flex items-center gap-4">
           <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                {m && (
                  <path 
                    className={isHealthy ? 'text-green-500' : 'text-red-500'} 
                    strokeDasharray={`${Math.min((m.ahr / 1000) * 100, 100)}, 100`} 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-black ${m ? (isHealthy ? 'text-green-500' : 'text-red-500') : 'theme-text-sub'}`}>
                  {m ? m.ahr : 'N/A'}
                </span>
                <span className="text-[8px] theme-text-sub font-bold uppercase">AHR</span>
              </div>
           </div>
           <div className="flex-1">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs theme-text-main font-bold flex items-center gap-1"><ThumbsUp size={12}/> Feedback Score</span>
               <span className="text-sm font-mono font-bold theme-text-main">{m?.feedbackScore || '-'}</span>
             </div>
             <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: m ? `${(m.feedbackScore / 5) * 100}%` : '0%' }} />
             </div>
             <div className="mt-1 text-[10px] theme-text-sub text-right">{m?.feedbackCount || 0} Ratings</div>
           </div>
        </div>

        <div className="space-y-4">
          {/* Shipping Group */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Truck size={12} className="text-blue-400" />
              <span className="text-[10px] theme-text-sub uppercase font-bold tracking-widest opacity-60">Logistics Performance</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MetricItem label="OTDR" val={m?.otdr} type="otdr" />
              <MetricItem label="VTR" val={m?.vtr} type="vtr" />
              <MetricItem label="LSR" val={m?.lsr} type="lsr" />
            </div>
          </div>

          {/* Compliance Group */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield size={12} className="text-[#FF2D92]" />
              <span className="text-[10px] theme-text-sub uppercase font-bold tracking-widest opacity-60">Compliance & Risk</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MetricItem label="ODR" val={m?.odr} type="odr" />
              <MetricItem label="PFCR" val={m?.pfcr} type="pfcr" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AHReportsPage: React.FC = () => {
  const { accounts } = useApp();

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-light theme-text-main tracking-tight">Account Health</h1>
          <p className="text-sm theme-text-sub mt-1 opacity-60">Real-time performance monitoring and risk assessment.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">
            <Activity size={14} /> Live Sync Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
        {accounts.map(acc => (
          <AccountHealthCard key={acc.id} account={acc} />
        ))}
      </div>
      
      {/* Legend / Info Footer */}
      <div className="mt-12 p-6 rounded-xl border theme-border bg-white/[0.02] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex gap-4">
            <div className="p-2 bg-yellow-500/10 rounded h-fit"><ShieldAlert className="text-yellow-500" size={20} /></div>
            <div>
                <h4 className="text-sm font-bold theme-text-main mb-1">AHR Thresholds</h4>
                <p className="text-xs theme-text-sub opacity-70 leading-relaxed">
                    Account Health Rating (AHR) determines your store's compliance status. 
                    <br/>
                    <span className="text-green-500 font-bold">200+ (Healthy)</span> • 
                    <span className="text-yellow-500 font-bold mx-1">100-199 (At Risk)</span> • 
                    <span className="text-red-500 font-bold">99 or less (Critical)</span>
                </p>
            </div>
        </div>
         <div className="flex gap-4">
            <div className="p-2 bg-blue-500/10 rounded h-fit"><Package className="text-blue-500" size={20} /></div>
            <div>
                <h4 className="text-sm font-bold theme-text-main mb-1">Shipping Targets</h4>
                <p className="text-xs theme-text-sub opacity-70 leading-relaxed grid grid-cols-2 gap-x-4">
                    <span>OTDR (On-Time Delivery): &gt;90%</span>
                    <span>VTR (Valid Tracking): &gt;90%</span>
                    <span>LSR (Late Shipment): &lt;4%</span>
                    <span>PFCR (Pre-fulfill Cancel): &lt;2.5%</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
