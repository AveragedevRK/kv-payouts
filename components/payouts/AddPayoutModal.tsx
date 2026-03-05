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
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;border-radius:12px;overflow:hidden;border:1px solid #1a1a1a;">
        <!-- Header with gradient accent bar -->
        <div style="height:4px;background:linear-gradient(90deg,#FF4D67,#FF2D92,#FF914D);"></div>

        <!-- Logo + Title -->
        <div style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #1a1a1a;">
          <img src="https://app.kambojventures.com/assets/images/logos/logo.png" alt="Kamboj Ventures" style="height:48px;margin:0 auto 16px;" />
          <h1 style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#666;font-weight:900;">KV PAYOUTS</h1>
          <h2 style="margin:0;font-size:22px;font-weight:900;color:#FF2D92;letter-spacing:-0.02em;">New Payout Recorded</h2>
        </div>

        <!-- Account name -->
        <div style="padding:20px 32px;background:#111;border-bottom:1px solid #1a1a1a;">
          <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#555;font-weight:700;">Account</p>
          <p style="margin:4px 0 0;font-size:18px;font-weight:900;color:#fff;letter-spacing:-0.02em;">${account.name}</p>
        </div>

        <!-- Payout details -->
        <div style="padding:24px 32px;">
          <!-- Amount highlight -->
          <div style="text-align:center;padding:20px;background:#141414;border:1px solid #1f1f1f;border-radius:8px;margin-bottom:20px;">
            <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:#555;font-weight:700;">Amount Received</p>
            <p style="margin:0;font-size:32px;font-weight:900;color:#fff;letter-spacing:-0.02em;">$${p.payoutAmount.toLocaleString()}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr>
              <td style="padding:12px 0;color:#555;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;border-bottom:1px solid #1a1a1a;">Date</td>
              <td style="padding:12px 0;text-align:right;color:#fff;font-weight:600;border-bottom:1px solid #1a1a1a;">${p.date}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#555;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;border-bottom:1px solid #1a1a1a;">Transfer ID</td>
              <td style="padding:12px 0;text-align:right;color:#fff;font-family:'SF Mono',Monaco,'Cascadia Code',monospace;font-size:12px;font-weight:600;border-bottom:1px solid #1a1a1a;">${p.transferId}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:#555;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;">Bank (Last Digits)</td>
              <td style="padding:12px 0;text-align:right;color:#fff;font-weight:600;">${p.bankAccount}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="padding:20px 32px;border-top:1px solid #1a1a1a;text-align:center;">
          <p style="margin:0 0 2px;font-size:10px;color:#333;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;">KV Payouts Dashboard &bull; Kamboj Ventures</p>
          <p style="margin:0;font-size:10px;color:#222;">Designed & Developed by GM & Rajab</p>
        </div>

        <!-- Bottom gradient accent bar -->
        <div style="height:4px;background:linear-gradient(90deg,#FF4D67,#FF2D92,#FF914D);"></div>
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
