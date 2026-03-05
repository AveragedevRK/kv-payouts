import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';
import { Account, Payout } from '../../types';
import { Mail } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; account: Account }

export const AddPayoutModal: React.FC<Props> = ({ isOpen, onClose, account }) => {
  const { addPayout } = useApp();
  const [amount, setAmount] = useState('0');
  const [tid, setTid] = useState('');
  const [bank, setBank] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notify, setNotify] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const alertEmails = account.notifiedUsers ?? [];
  const hasAlertEmails = alertEmails.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p: Payout = {
      id: Date.now().toString(),
      date,
      payoutAmount: Number(amount),
      transferId: tid || 'MANUAL-' + Date.now().toString().slice(-4),
      bankAccount: bank || '000',
      isNew: true
    };

    addPayout(account.id, p);

    // If notify is off or no emails, close immediately
    if (!notify || !hasAlertEmails) {
      onClose();
      return;
    }

    // Send emails BEFORE closing -- closing unmounts the component and kills in-flight fetches
    setSending(true);
    setSendError(null);

    const EMAIL_API = 'https://vm-n35zy75fyi2iwf6wu0w7ik.vusercontent.net/api/send-email';
    const emailHtml = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#111;color:#fff;border-radius:8px;">
        <h2 style="margin:0 0 16px;font-size:20px;color:#FF2D92;">New Payout Recorded</h2>
        <p style="margin:0 0 16px;color:#aaa;">A new payout has been logged for <strong style="color:#fff;">${account.name}</strong>.</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #222;">Amount</td><td style="padding:8px 0;text-align:right;font-weight:bold;color:#fff;border-bottom:1px solid #222;">$${p.payoutAmount.toLocaleString()}</td></tr>
          <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #222;">Date</td><td style="padding:8px 0;text-align:right;color:#fff;border-bottom:1px solid #222;">${p.date}</td></tr>
          <tr><td style="padding:8px 0;color:#888;border-bottom:1px solid #222;">Transfer ID</td><td style="padding:8px 0;text-align:right;font-family:monospace;color:#fff;border-bottom:1px solid #222;">${p.transferId}</td></tr>
          <tr><td style="padding:8px 0;color:#888;">Bank (last digits)</td><td style="padding:8px 0;text-align:right;color:#fff;">${p.bankAccount}</td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#555;">Sent from KV Payouts Dashboard</p>
      </div>
    `;
    const emailSubject = `New Payout Logged - ${account.name}`;

    try {
      const results = await Promise.all(
        alertEmails.map(async (email) => {
          const res = await fetch(EMAIL_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: email, subject: emailSubject, html: emailHtml }),
          });
          const body = await res.json();
          return { email, ok: res.ok, status: res.status, body };
        })
      );

      const failures = results.filter(r => !r.ok);
      if (failures.length > 0) {
        const msgs = failures.map(f => `${f.email}: ${f.body?.error || f.status}`).join('; ');
        setSendError(`Failed for: ${msgs}`);
        setSending(false);
        return;
      }
    } catch (err: any) {
      setSendError(`Email failed: ${err?.message || 'Network error'}`);
      setSending(false);
      return;
    }
    setSending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Log Manual Payout">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm" />
          </div>
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">{'Amount Received ($)'}</label>
            <input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm text-lg font-bold" />
          </div>
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">Transfer ID</label>
            <input type="text" value={tid} onChange={e => setTid(e.target.value)} placeholder="e.g. 478URWO..." className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm font-mono" />
          </div>
          <div>
            <label className="text-[10px] theme-text-sub uppercase mb-1 block">{'Bank Account (Last 3-4 digits)'}</label>
            <input type="text" value={bank} onChange={e => setBank(e.target.value)} placeholder="268" className="w-full theme-bg-page border theme-border p-2 theme-text-main rounded-sm" />
          </div>
        </div>

        <div className={`flex items-start gap-3 p-3 rounded border ${hasAlertEmails ? 'theme-border theme-bg-page' : 'border-dashed theme-border opacity-50'}`}>
          <input
            type="checkbox"
            id="notify-emails"
            checked={notify}
            onChange={e => setNotify(e.target.checked)}
            disabled={!hasAlertEmails}
            className="mt-0.5 accent-[#FF2D92] w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
          />
          <label htmlFor="notify-emails" className={`flex-1 ${hasAlertEmails ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Mail size={12} className="theme-text-sub" />
              <span className="text-xs font-bold theme-text-main">Notify alert contacts</span>
            </div>
            {hasAlertEmails ? (
              <p className="text-[11px] theme-text-sub leading-snug">
                {'Send payout details to '}
                <span className="font-semibold theme-text-main">{alertEmails.length}</span>
                {alertEmails.length === 1 ? ' contact: ' : ' contacts: '}
                <span className="font-mono text-[10px]">{alertEmails.join(', ')}</span>
              </p>
            ) : (
              <p className="text-[11px] theme-text-sub leading-snug">
                No alert emails configured for this account. Add contacts in the Manage Notifications modal.
              </p>
            )}
          </label>
        </div>

        {sendError && (
          <div className="p-3 rounded border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono leading-relaxed">
            {sendError}
          </div>
        )}

        <Button type="submit" disabled={sending} className="mt-2">
          {sending ? 'Sending notifications...' : 'Save Entry'}
        </Button>
      </form>
    </Modal>
  );
};
