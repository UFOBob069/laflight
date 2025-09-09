import { google } from 'googleapis';
import dayjs from 'dayjs';

export async function fetchRecentDealEmails({ label, days = 7 }:{
  label: string; days?: number;
}) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN! });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  const q = `label:${JSON.stringify(label)} newer_than:${days}d`;
  const res = await gmail.users.messages.list({ userId: 'me', q, maxResults: 200 });
  const messages = res.data.messages ?? [];

  const out: Array<{
    messageId: string; subject: string; html?: string; text?: string; receivedAt: string;
  }> = [];

  for (const m of messages) {
    const msg = await gmail.users.messages.get({ userId: 'me', id: m.id! });
    const headers = msg.data.payload?.headers || [];
    const subject = headers.find(h => h.name === 'Subject')?.value || '';
    const dateHdr = headers.find(h => h.name === 'Date')?.value || '';
    const receivedAt = new Date(dateHdr || Date.now()).toISOString();

    let html = '';
    let text = '';
    const parts = collectParts(msg.data.payload);
    for (const p of parts) {
      if (p.mimeType === 'text/html' && p.body?.data) {
        html = Buffer.from(p.body.data, 'base64').toString('utf8');
      } else if (p.mimeType === 'text/plain' && p.body?.data) {
        text = Buffer.from(p.body.data, 'base64').toString('utf8');
      }
    }

    out.push({ messageId: msg.data.id!, subject, html, text, receivedAt });
  }
  return out;
}

// flatten MIME tree
function collectParts(node: any): any[] {
  if (!node) return [];
  if (node.parts) return node.parts.flatMap((p: any) => collectParts(p));
  return [node];
}
