/**
 * Non-interactive check: loads .env / .env.local and tries to refresh + call Gmail API.
 * Run: node scripts/verify-gmail-oauth.js
 */
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { loadGoogleEnvFromDotfiles } = require('./load-google-env');

function mask(s, show = 12) {
  if (!s) return '(empty)';
  if (s.length <= show) return `${s.length} chars`;
  return `${s.slice(0, show)}... (${s.length} chars)`;
}

async function main() {
  const cwd = process.cwd();
  console.log('Working directory:', cwd);
  loadGoogleEnvFromDotfiles(cwd);

  const hasEnv = ['.env', '.env.local'].map((n) => {
    const p = path.join(cwd, n);
    return `${n}: ${fs.existsSync(p) ? 'yes' : 'no'}`;
  });
  console.log('Env files:', hasEnv.join(' | '));

  const clientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
  const clientSecret = (process.env.GOOGLE_CLIENT_SECRET || '').trim();
  const redirectUri =
    (process.env.GOOGLE_REDIRECT_URI || '').trim() || 'http://localhost:8080/callback';
  const refreshToken = (process.env.GOOGLE_REFRESH_TOKEN || '').trim();

  console.log('\nGOOGLE_CLIENT_ID:', clientId ? mask(clientId, 24) : 'MISSING');
  console.log('GOOGLE_CLIENT_SECRET:', clientSecret ? 'set' : 'MISSING');
  console.log('GOOGLE_REDIRECT_URI:', redirectUri);
  console.log('GOOGLE_REFRESH_TOKEN:', refreshToken ? mask(refreshToken, 16) : 'MISSING (run npm run oauth-simple)');

  if (!clientId || !clientSecret) {
    console.error('\nFAIL: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
    process.exit(1);
  }
  if (!refreshToken) {
    console.error('\nFAIL: GOOGLE_REFRESH_TOKEN is empty. Complete npm run oauth-simple first.');
    process.exit(1);
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  try {
    await oauth2Client.getAccessToken();
    console.log('\nOK: Access token refresh succeeded.');
  } catch (e) {
    console.error('\nFAIL: Could not refresh access token.');
    console.error('Message:', e.message);
    if (e.response?.data) console.error('Google:', JSON.stringify(e.response.data, null, 2));
    console.error(
      '\nFix: GOOGLE_REDIRECT_URI in .env must match the redirect used when this refresh token was created,'
    );
    console.error('and Client ID/secret must be the same OAuth client. Re-run oauth-simple if needed.');
    process.exit(1);
  }

  try {
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const labels = await gmail.users.labels.list({ userId: 'me' });
    const n = labels.data.labels?.length ?? 0;
    console.log(`OK: Gmail API responded (labels.list returned ${n} labels).`);
    console.log('Ingest should be able to read this mailbox.');
  } catch (e) {
    console.error('\nFAIL: Gmail API call after refresh.');
    console.error('Message:', e.message);
    if (e.response?.data) console.error('Google:', JSON.stringify(e.response.data, null, 2));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
