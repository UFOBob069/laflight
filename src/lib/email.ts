import { Resend } from 'resend';

let resend: Resend | null = null;

function getResendClient() {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not configured');
    }
    resend = new Resend(apiKey);
  }
  return resend;
}

export async function sendDigestEmail({ to, deals }: { to: string; deals: any[] }) {
  const html = `
  <div style="font-family:system-ui,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <h2 style="color:#333;border-bottom:2px solid #eee;padding-bottom:10px">Top Flight Deals (Last 7 Days)</h2>
    <ol style="list-style:none;padding:0">
      ${deals.map((d: any) => `
        <li style="border:1px solid #eee;border-radius:8px;padding:15px;margin-bottom:10px;background:#f9f9f9">
          <strong style="color:#2563eb">${d.origin} → ${d.destination}</strong> 
          <span style="color:#059669;font-weight:bold">$${d.price?.toLocaleString() ?? '—'}</span> 
          <em style="color:#6b7280">${d.dates ?? ''}</em> 
          <a href="${d.link}" target="_blank" style="color:#2563eb;text-decoration:none;margin-left:10px">View Deal →</a>
        </li>
      `).join('')}
    </ol>
    <p style="text-align:center;color:#6b7280;margin-top:30px;font-size:14px">
      Powered by Flight Deals Monitor
    </p>
  </div>`;

  const client = getResendClient();
  const result = await client.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Weekly Flight Deals Digest - ${deals.length} deals found`,
    html,
  });

  return result;
}
