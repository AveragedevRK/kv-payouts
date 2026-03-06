import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, AlertTriangle, CheckCircle, Shield, ShieldAlert, Package, ThumbsUp, Truck, Pencil, X, Save } from 'lucide-react';
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

/** Returns true if the healthMetrics object actually has data (not just an empty {}) */
const hasMetrics = (m: AHMetrics | undefined | null): m is AHMetrics => {
  if (!m) return false;
  return typeof m.ahr === 'number';
};

const MetricItem = ({ label, val, type, suffix = '%' }: { label: string; val: number | undefined; type: keyof AHMetrics; suffix?: string }) => {
  if (val === undefined || val === null) return (
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

/* ──────────────────────────────────────────── */
/*  Inline Edit Form                            */
/* ──────────────────────────────────────────── */

interface EditFormProps {
  account: Account;
  onClose: () => void;
}

const METRIC_FIELDS: { key: keyof AHMetrics; label: string; hint: string }[] = [
  { key: 'ahr', label: 'AHR', hint: 'Target >= 200' },
  { key: 'odr', label: 'ODR %', hint: 'Target < 1%' },
  { key: 'otdr', label: 'OTDR %', hint: 'Target > 90%' },
  { key: 'vtr', label: 'VTR %', hint: 'Target > 90%' },
  { key: 'lsr', label: 'LSR %', hint: 'Target < 4%' },
  { key: 'pfcr', label: 'PFCR %', hint: 'Target < 2.5%' },
  { key: 'feedbackScore', label: 'Feedback Score', hint: '0 - 5' },
  { key: 'feedbackCount', label: 'Feedback Count', hint: 'Total ratings' },
];

const EditMetricsForm: React.FC<EditFormProps> = ({ account, onClose }) => {
  const { updateHealthMetrics } = useApp();
  const existing = hasMetrics(account.healthMetrics) ? account.healthMetrics : null;
  const [saving, setSaving] = useState(false);

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of METRIC_FIELDS) {
      init[f.key] = existing ? String(existing[f.key] ?? '') : '';
    }
    return init;
  });

  const handleChange = (key: string, raw: string) => {
    setValues(prev => ({ ...prev, [key]: raw }));
  };

  const handleSave = async () => {
    setSaving(true);
    const partial: Partial<AHMetrics> = {};
    for (const f of METRIC_FIELDS) {
      const v = parseFloat(values[f.key]);
      if (!isNaN(v)) {
        (partial as any)[f.key] = v;
      }
    }
    await updateHealthMetrics(account.id, partial);
    setSaving(false);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm rounded-xl flex flex-col animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h4 className="text-sm font-bold theme-text-main">Update Health Metrics</h4>
        <button onClick={onClose} className="theme-text-sub hover:theme-text-main transition-colors p-1">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {METRIC_FIELDS.map(f => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-[10px] theme-text-sub uppercase font-bold tracking-wider opacity-70">{f.label}</label>
              <input
                type="number"
                step="any"
                placeholder={f.hint}
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                className="w-full bg-white/5 border theme-border rounded px-2.5 py-1.5 text-sm theme-text-main outline-none focus:border-[#FF2D92] transition-colors font-mono placeholder:opacity-30"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-white/10 flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-1.5 text-xs font-bold theme-text-sub rounded border theme-border hover:bg-white/5 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1.5 text-xs font-bold text-white bg-[#FF2D92] rounded hover:bg-[#FF2D92]/80 transition-colors flex items-center gap-1.5 disabled:opacity-50"
        >
          <Save size={12} />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────── */
/*  Account Health Card                         */
/* ──────────────────────────────────────────── */

const AccountHealthCard = ({ account }: { account: Account }) => {
  const [editing, setEditing] = useState(false);
  const m = hasMetrics(account.healthMetrics) ? account.healthMetrics : null;
  const isHealthy = m ? m.ahr >= 200 : true;
  const statusColor = m
    ? (isHealthy ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500')
    : 'border-l-4 border-l-gray-600';

  return (
    <div className={`theme-bg-card border theme-border rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col relative ${statusColor}`}>
      {/* Edit Overlay */}
      {editing && <EditMetricsForm account={account} onClose={() => setEditing(false)} />}

      {/* Header */}
      <div className="p-5 border-b theme-border bg-white/[0.02] flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold theme-text-main leading-none mb-1">{account.name}</h3>
          <span className="text-[10px] theme-text-sub uppercase tracking-widest font-bold opacity-60 flex items-center gap-1">
            {account.platform} <span className="w-1 h-1 rounded-full bg-white/20 mx-1" /> ID: {account.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 rounded border theme-border hover:border-[#FF2D92]/50 hover:bg-[#FF2D92]/10 theme-text-sub hover:text-[#FF2D92] transition-all"
            title="Update health metrics"
          >
            <Pencil size={13} />
          </button>
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
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-6">
        {!m ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center py-8 gap-3 opacity-60">
            <ShieldAlert size={32} className="theme-text-sub opacity-40" />
            <p className="text-xs theme-text-sub text-center leading-relaxed">
              No health data yet.<br />
              Click the pencil icon to add metrics.
            </p>
          </div>
        ) : (
          <>
            {/* AHR Hero */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path
                    className={isHealthy ? 'text-green-500' : 'text-red-500'}
                    strokeDasharray={`${Math.min((m.ahr / 1000) * 100, 100)}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-xl font-black ${isHealthy ? 'text-green-500' : 'text-red-500'}`}>
                    {m.ahr}
                  </span>
                  <span className="text-[8px] theme-text-sub font-bold uppercase">AHR</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs theme-text-main font-bold flex items-center gap-1"><ThumbsUp size={12} /> Feedback Score</span>
                  <span className="text-sm font-mono font-bold theme-text-main">{m.feedbackScore ?? '-'}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(m.feedbackScore / 5) * 100}%` }} />
                </div>
                <div className="mt-1 text-[10px] theme-text-sub text-right">{m.feedbackCount ?? 0} Ratings</div>
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
                  <MetricItem label="OTDR" val={m.otdr} type="otdr" />
                  <MetricItem label="VTR" val={m.vtr} type="vtr" />
                  <MetricItem label="LSR" val={m.lsr} type="lsr" />
                </div>
              </div>

              {/* Compliance Group */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={12} className="text-[#FF2D92]" />
                  <span className="text-[10px] theme-text-sub uppercase font-bold tracking-widest opacity-60">Compliance & Risk</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <MetricItem label="ODR" val={m.odr} type="odr" />
                  <MetricItem label="PFCR" val={m.pfcr} type="pfcr" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────── */
/*  Page                                        */
/* ──────────────────────────────────────────── */

export const AHReportsPage: React.FC = () => {
  const { accounts } = useApp();

  // Sort accounts by total payout volume descending
  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      const aVol = (a.payouts ?? []).reduce((s, p) => s + p.payoutAmount, 0);
      const bVol = (b.payouts ?? []).reduce((s, p) => s + p.payoutAmount, 0);
      return bVol - aVol;
    });
  }, [accounts]);

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

      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 theme-text-sub opacity-60">
          <ShieldAlert size={48} className="opacity-40" />
          <p className="text-sm text-center">No accounts found. Add an account first to track health metrics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {sortedAccounts.map(acc => (
            <AccountHealthCard key={acc.id} account={acc} />
          ))}
        </div>
      )}

      {/* Legend / Info Footer */}
      <div className="mt-12 p-6 rounded-xl border theme-border bg-white/[0.02] grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex gap-4">
          <div className="p-2 bg-yellow-500/10 rounded h-fit"><ShieldAlert className="text-yellow-500" size={20} /></div>
          <div>
            <h4 className="text-sm font-bold theme-text-main mb-1">AHR Thresholds</h4>
            <p className="text-xs theme-text-sub opacity-70 leading-relaxed">
              Account Health Rating (AHR) determines your store{"'"}s compliance status.
              <br />
              <span className="text-green-500 font-bold">{'200+ (Healthy)'}</span>{' '}
              <span className="text-yellow-500 font-bold mx-1">{'100-199 (At Risk)'}</span>{' '}
              <span className="text-red-500 font-bold">{'99 or less (Critical)'}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="p-2 bg-blue-500/10 rounded h-fit"><Package className="text-blue-500" size={20} /></div>
          <div>
            <h4 className="text-sm font-bold theme-text-main mb-1">Shipping Targets</h4>
            <p className="text-xs theme-text-sub opacity-70 leading-relaxed grid grid-cols-2 gap-x-4">
              <span>{'OTDR (On-Time Delivery): >90%'}</span>
              <span>{'VTR (Valid Tracking): >90%'}</span>
              <span>{'LSR (Late Shipment): <4%'}</span>
              <span>{'PFCR (Pre-fulfill Cancel): <2.5%'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
