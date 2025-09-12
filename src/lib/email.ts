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

export async function sendDigestEmail({ to, deals, isPaid = false }: { to: string; deals: any[]; isPaid?: boolean }) {
  const displayDeals = isPaid ? deals : deals.slice(0, 3); // Free users get top 3 only
  const totalDeals = deals.length;
  
  const html = `
  <div style="font-family:system-ui,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <h2 style="color:#333;border-bottom:2px solid #eee;padding-bottom:10px">
      ${isPaid ? 'All Flight Deals' : 'Top Flight Deals'} (Last 7 Days)
    </h2>
    
    ${!isPaid ? `
    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:15px;margin-bottom:20px">
      <p style="margin:0;color:#92400e;font-size:14px">
        <strong>Free Preview:</strong> You're seeing the top 3 deals. 
        <a href="${process.env.SITE_URL}/pricing" style="color:#92400e;text-decoration:underline">Upgrade to Premium</a> 
        to see all ${totalDeals} deals with booking links!
      </p>
    </div>
    ` : ''}
    
    <ol style="list-style:none;padding:0">
      ${displayDeals.map((d: any) => `
        <li style="border:1px solid #eee;border-radius:8px;padding:15px;margin-bottom:10px;background:#f9f9f9">
          <strong style="color:#2563eb">${d.origin} → ${d.destination}</strong> 
          <span style="color:#059669;font-weight:bold">$${d.price?.toLocaleString() ?? '—'}</span> 
          <em style="color:#6b7280">${d.dates ?? ''}</em> 
          ${isPaid && d.link ? 
            `<a href="${d.link}" target="_blank" style="color:#2563eb;text-decoration:none;margin-left:10px">View Deal →</a>` : 
            '<span style="color:#6b7280;margin-left:10px">Upgrade to view link</span>'
          }
        </li>
      `).join('')}
    </ol>
    
    ${!isPaid ? `
    <div style="background:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:20px;margin:20px 0;text-align:center">
      <h3 style="color:#0c4a6e;margin-top:0">Want More Deals?</h3>
      <p style="color:#0c4a6e;margin:10px 0">Get all ${totalDeals} deals with direct booking links for just $20/year!</p>
      <a href="${process.env.SITE_URL}/pricing" style="background:#0ea5e9;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold">
        Upgrade to Premium
      </a>
    </div>
    ` : ''}
    
    <p style="text-align:center;color:#6b7280;margin-top:30px;font-size:14px">
      Powered by Flight Deals Monitor
    </p>
  </div>`;

  const client = getResendClient();
  const result = await client.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Weekly Flight Deals Digest - ${displayDeals.length}${isPaid ? '' : ` of ${totalDeals}`} deals found`,
    html,
  });

  return result;
}

export async function sendWelcomeEmail(email: string) {
  const html = `
  <div style="font-family:system-ui,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <h2 style="color:#333;border-bottom:2px solid #eee;padding-bottom:10px">Welcome to Flight Deals Monitor! ✈️</h2>
    
    <p style="color:#555;line-height:1.6;margin-bottom:20px">
      Thanks for subscribing! You'll now receive our <strong>free weekly digest</strong> with the top 3 flight deals we find.
    </p>
    
    <div style="background:#f0f9ff;border:1px solid #0ea5e9;border-radius:8px;padding:20px;margin:20px 0">
      <h3 style="color:#0c4a6e;margin-top:0">What you get for FREE:</h3>
      <ul style="color:#0c4a6e;margin:0;padding-left:20px">
        <li>Top 3 flight deals every week</li>
        <li>Basic route information</li>
        <li>Sample pricing (no booking links)</li>
      </ul>
    </div>
    
    <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:8px;padding:20px;margin:20px 0">
      <h3 style="color:#92400e;margin-top:0">Want MORE? Upgrade to Premium:</h3>
      <ul style="color:#92400e;margin:0;padding-left:20px">
        <li>All deals (50+ per week)</li>
        <li>Direct booking links</li>
        <li>Custom route filters</li>
        <li>Price alerts</li>
        <li>Sortable deal table</li>
      </ul>
      <p style="margin:15px 0 0 0">
        <a href="${process.env.SITE_URL}/pricing" style="background:#f59e0b;color:white;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:bold">
          Upgrade Now - $20/year
        </a>
      </p>
    </div>
    
    <p style="text-align:center;color:#6b7280;margin-top:30px;font-size:14px">
      Your first digest will arrive next Sunday!<br>
      <a href="${process.env.SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#6b7280;text-decoration:underline">Unsubscribe</a>
    </p>
  </div>`;

  const client = getResendClient();
  const result = await client.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Welcome to Flight Deals Monitor! ✈️',
    html,
  });

  return result;
}