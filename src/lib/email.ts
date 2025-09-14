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
  const displayDeals = isPaid ? deals : deals.slice(0, 5); // Free users get top 5 deals
  const totalDeals = deals.length;
  
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Best LAX Deals - Weekly Flight Deals</title>
    <meta name="description" content="Weekly digest of the best flight deals from Los Angeles">
  </head>
  <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:30px 20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;text-shadow:0 2px 4px rgba(0,0,0,0.1)">
          ✈️ Best LAX Deals
        </h1>
        <p style="color:#e0e7ff;margin:8px 0 0 0;font-size:16px;font-weight:500">
          ${isPaid ? 'All Flight Deals' : 'Lowest Priced Deals'} • Last 7 Days • ${displayDeals.length}${isPaid ? '' : ` of ${totalDeals}`} deals found
        </p>
      </div>
      
      <!-- Introduction -->
      <div style="padding:25px 20px;background:#ffffff;border-bottom:1px solid #e5e7eb">
        <h2 style="color:#1f2937;margin:0 0 15px 0;font-size:20px;font-weight:600">
          Your Weekly Flight Deals Digest
        </h2>
        <p style="color:#4b5563;margin:0 0 15px 0;font-size:15px;line-height:1.6">
          Best LAX Deals monitors 50+ flight deal sources 24/7 to bring you the lowest prices from Los Angeles. 
          We find deals that save you $30-179 per year compared to competitors.
        </p>
        <div style="text-align:center;margin-top:20px">
          <a href="${process.env.SITE_URL}/deals" style="background:#3b82f6;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block">
            View All Deals & Sort →
          </a>
        </div>
      </div>
      
      <!-- Free User Banner -->
      ${!isPaid ? `
      <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border-left:4px solid #f59e0b;margin:0;padding:20px">
        <div style="display:flex;align-items:center;margin-bottom:10px">
          <span style="font-size:24px;margin-right:10px">🔒</span>
          <h3 style="color:#92400e;margin:0;font-size:18px;font-weight:600">Free Preview</h3>
        </div>
        <p style="color:#92400e;margin:0;font-size:15px;line-height:1.5">
          You're seeing the <strong>5 lowest priced deals</strong>. 
          <a href="${process.env.SITE_URL}/pricing" style="color:#92400e;text-decoration:underline;font-weight:600">Upgrade to Premium</a> 
          to see all ${totalDeals} deals with direct booking links!
        </p>
      </div>
      ` : ''}
      
      <!-- Deals List -->
      <div style="padding:0 20px 20px 20px">
        ${displayDeals.map((d: any, index: number) => `
          <div style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:${index === 0 ? '20px 0 15px 0' : '15px 0'};box-shadow:0 2px 4px rgba(0,0,0,0.05)">
            <!-- Deal Header -->
            <div style="display:flex;align-items:center;margin-bottom:12px">
              <span style="background:#3b82f6;color:#ffffff;padding:4px 8px;border-radius:6px;font-size:12px;font-weight:600;margin-right:12px">
                #${index + 1}
              </span>
              <span style="color:#1f2937;font-size:20px;font-weight:700">
                ${d.origin} → ${d.destination}
              </span>
            </div>
            
            <!-- Deal Details -->
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:15px">
              <div style="flex:1">
                <div style="color:#6b7280;font-size:14px;font-weight:500;margin-bottom:8px">
                  ${d.dates ?? 'Dates TBD'}
                </div>
                <div style="color:#059669;font-size:28px;font-weight:800;line-height:1">
                  $${d.price?.toLocaleString() ?? '—'}
                  <span style="color:#6b7280;font-size:14px;font-weight:500;margin-left:4px">per person</span>
                </div>
              </div>
              
              <div style="margin-left:20px;flex-shrink:0">
                ${isPaid && d.link ? 
                  `<a href="${d.link}" target="_blank" style="background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;box-shadow:0 2px 4px rgba(59,130,246,0.3);white-space:nowrap">
                    View Deal →
                  </a>` : 
                  `<span style="background:#f3f4f6;color:#6b7280;padding:12px 20px;border-radius:8px;font-weight:600;font-size:14px;display:inline-block;border:1px solid #d1d5db;white-space:nowrap">
                    Upgrade to view
                  </span>`
                }
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Upgrade CTA -->
      ${!isPaid ? `
      <div style="background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border:1px solid #0ea5e9;margin:0 20px 20px 20px;border-radius:12px;padding:25px;text-align:center">
        <div style="margin-bottom:15px">
          <span style="font-size:32px;margin-right:10px">🚀</span>
          <h3 style="color:#0c4a6e;margin:0;font-size:22px;font-weight:700;display:inline-block">
            Want More Deals?
          </h3>
        </div>
        <p style="color:#0c4a6e;margin:0 0 20px 0;font-size:16px;line-height:1.5">
          Get access to all <strong>${totalDeals} deals</strong> with direct booking links, 
          sorting features, and exclusive international destinations for just <strong>$20/year</strong>!
        </p>
        <a href="${process.env.SITE_URL}/pricing" style="background:linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%);color:#ffffff;padding:15px 30px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:700;font-size:16px;box-shadow:0 4px 6px rgba(14,165,233,0.3);transition:all 0.2s ease">
          Upgrade to Premium - $20/year
        </a>
        <p style="color:#0c4a6e;margin:15px 0 0 0;font-size:14px;font-weight:500">
          Less than $2/month • Cancel anytime
        </p>
      </div>
      ` : ''}
      
      <!-- Footer -->
      <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="color:#6b7280;margin:0;font-size:14px;font-weight:500">
          Powered by <strong>Best LAX Deals</strong> • 
          <a href="${process.env.SITE_URL}/unsubscribe?email=${encodeURIComponent(to)}" style="color:#6b7280;text-decoration:underline">
            Unsubscribe
          </a>
        </p>
      </div>
      
    </div>
  </body>
  </html>`;

  const client = getResendClient();
  const result = await client.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    reply_to: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM!,
    subject: `Best LAX Deals: ${displayDeals.length}${isPaid ? '' : ` of ${totalDeals}`} flight deals this week`,
    html,
    headers: {
      'X-Mailer': 'Best LAX Deals',
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
    },
    tags: [
      {
        name: 'newsletter',
        value: 'weekly-deals'
      },
      {
        name: 'user-type',
        value: isPaid ? 'premium' : 'free'
      }
    ]
  });

  return result;
}

export async function sendWelcomeEmail(email: string) {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Best LAX Deals!</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
      
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#3b82f6 0%,#1d4ed8 100%);padding:40px 20px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:32px;font-weight:700;text-shadow:0 2px 4px rgba(0,0,0,0.1)">
          🎉 Welcome to Best LAX Deals!
        </h1>
        <p style="color:#e0e7ff;margin:12px 0 0 0;font-size:18px;font-weight:500">
          Your journey to incredible flight deals starts now
        </p>
      </div>
      
      <!-- Main Content -->
      <div style="padding:30px 20px">
        <p style="color:#374151;line-height:1.6;margin:0 0 25px 0;font-size:16px;text-align:center">
          Thanks for subscribing! You'll now receive our <strong>free weekly digest</strong> with the 
          <strong>5 lowest priced flight deals</strong> we find every week.
        </p>
        
        <!-- Free Features -->
        <div style="background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border:1px solid #0ea5e9;border-radius:12px;padding:25px;margin:25px 0">
          <div style="text-align:center;margin-bottom:20px">
            <span style="font-size:28px;margin-right:10px">🆓</span>
            <h3 style="color:#0c4a6e;margin:0;font-size:20px;font-weight:700;display:inline-block">
              What you get for FREE:
            </h3>
          </div>
          <ul style="color:#0c4a6e;margin:0;padding-left:0;list-style:none">
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#0ea5e9;font-weight:bold">✓</span>
              <strong>5 lowest priced deals</strong> every week
            </li>
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#0ea5e9;font-weight:bold">✓</span>
              Complete route and date information
            </li>
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#0ea5e9;font-weight:bold">✓</span>
              Sample pricing (upgrade for booking links)
            </li>
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#0ea5e9;font-weight:bold">✓</span>
              Weekly digest delivered every Sunday
            </li>
          </ul>
        </div>
        
        <!-- Premium Features -->
        <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde68a 100%);border:1px solid #f59e0b;border-radius:12px;padding:25px;margin:25px 0">
          <div style="text-align:center;margin-bottom:20px">
            <span style="font-size:28px;margin-right:10px">🚀</span>
            <h3 style="color:#92400e;margin:0;font-size:20px;font-weight:700;display:inline-block">
              Want MORE? Upgrade to Premium:
            </h3>
          </div>
          <ul style="color:#92400e;margin:0 0 20px 0;padding-left:0;list-style:none">
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#f59e0b;font-weight:bold">⭐</span>
              <strong>All deals</strong> (50+ per week) with direct booking links
            </li>
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#f59e0b;font-weight:bold">⭐</span>
              <strong>International destinations</strong> (not just domestic)
            </li>
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#f59e0b;font-weight:bold">⭐</span>
              <strong>Sorting & filtering</strong> features
            </li>
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#f59e0b;font-weight:bold">⭐</span>
              <strong>Price alerts</strong> for specific routes
            </li>
            <li style="margin:12px 0;padding-left:30px;position:relative">
              <span style="position:absolute;left:0;color:#f59e0b;font-weight:bold">⭐</span>
              <strong>Mobile-optimized</strong> deal browsing
            </li>
          </ul>
          <div style="text-align:center">
            <a href="${process.env.SITE_URL}/pricing" style="background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#ffffff;padding:15px 30px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:700;font-size:16px;box-shadow:0 4px 6px rgba(245,158,11,0.3);transition:all 0.2s ease">
              Upgrade Now - $20/year
            </a>
            <p style="color:#92400e;margin:12px 0 0 0;font-size:14px;font-weight:500">
              Less than $2/month • Cancel anytime
            </p>
          </div>
        </div>
        
        <!-- Next Steps -->
        <div style="background:#f8fafc;border:1px solid #e5e7eb;border-radius:12px;padding:25px;margin:25px 0;text-align:center">
          <span style="font-size:24px;margin-right:10px">📅</span>
          <h3 style="color:#374151;margin:0 0 10px 0;font-size:18px;font-weight:600">
            What's Next?
          </h3>
          <p style="color:#6b7280;margin:0;font-size:15px;line-height:1.5">
            Your first digest will arrive <strong>next Sunday</strong> with the latest flight deals!<br>
            In the meantime, check out our <a href="${process.env.SITE_URL}/deals" style="color:#3b82f6;text-decoration:underline;font-weight:600">current deals page</a>.
          </p>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="color:#6b7280;margin:0;font-size:14px;font-weight:500">
          Powered by <strong>Best LAX Deals</strong> • 
          <a href="${process.env.SITE_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color:#6b7280;text-decoration:underline">
            Unsubscribe
          </a>
        </p>
      </div>
      
    </div>
  </body>
  </html>`;

  const client = getResendClient();
  const result = await client.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    reply_to: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM!,
    subject: 'Welcome to Best LAX Deals - Your weekly flight deals are ready',
    html,
    headers: {
      'X-Mailer': 'Best LAX Deals',
      'X-Priority': '3',
      'X-MSMail-Priority': 'Normal',
      'Importance': 'Normal',
    },
    tags: [
      {
        name: 'email-type',
        value: 'welcome'
      }
    ]
  });

  return result;
}