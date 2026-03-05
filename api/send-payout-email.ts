import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { emails, accountName, payout } = req.body;

  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ error: 'No email recipients provided' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'KV Payouts <payouts@kvsmart.io>',
      to: emails,
      subject: `New Payout Logged — ${accountName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
          <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 700;">New Payout Recorded</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px; width: 140px;">Account</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${accountName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Amount</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">$${Number(payout.payoutAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Date</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px;">${payout.date}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; color: #666; font-size: 13px;">Transfer ID</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e5e5e5; font-weight: 600; font-size: 14px; font-family: monospace;">${payout.transferId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; font-size: 13px;">Bank (last digits)</td>
              <td style="padding: 10px 0; font-weight: 600; font-size: 14px;">${payout.bankAccount}</td>
            </tr>
          </table>
          <p style="font-size: 12px; color: #999; margin: 0;">Sent by KV Payouts Dashboard</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err: any) {
    console.error('Email send failed:', err);
    return res.status(500).json({ error: err.message || 'Failed to send email' });
  }
}
