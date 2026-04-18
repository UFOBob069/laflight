const { google } = require('googleapis');
const readline = require('readline');
const http = require('http');
const { loadGoogleEnvFromDotfiles } = require('./load-google-env');

const verbose = process.argv.includes('--verbose') || process.argv.includes('-v');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function isLocalRedirect(redirectUri) {
  try {
    const u = new URL(redirectUri);
    return u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function normalizePath(p) {
  if (!p || p === '/') return p || '/';
  return p.endsWith('/') ? p.slice(0, -1) : p;
}

/**
 * Listens for Google's redirect, returns the ?code= value once.
 * onListening runs only after the server is accepting connections.
 */
function waitForOAuthCallback(redirectUri, onListening, timeoutMs = 10 * 60 * 1000) {
  const u = new URL(redirectUri);
  const port = u.port ? parseInt(u.port, 10) : u.protocol === 'https:' ? 443 : 80;
  const expectedPath = normalizePath(u.pathname || '/');

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (verbose) {
        console.log('[callback]', req.method, req.url || '');
      }

      let requestUrl;
      try {
        requestUrl = new URL(req.url || '/', `http://127.0.0.1:${port}`);
      } catch {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad request');
        return;
      }

      const reqPath = normalizePath(requestUrl.pathname);
      if (reqPath !== expectedPath) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(
          `Not found.\nExpected path: ${expectedPath}\nGot path: ${reqPath}\nFull URL path+query was: ${req.url}\n`
        );
        return;
      }

      const err = requestUrl.searchParams.get('error');
      if (err) {
        const desc = requestUrl.searchParams.get('error_description') || err;
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          `<!DOCTYPE html><html><body><p>OAuth error: <strong>${err}</strong></p><p>${desc}</p></body></html>`
        );
        clearTimeout(timeoutId);
        server.close();
        reject(new Error(desc));
        return;
      }

      const code = requestUrl.searchParams.get('code');
      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<!DOCTYPE html><html><body><p>Missing <code>code</code> in redirect.</p></body></html>');
        return;
      }

      clearTimeout(timeoutId);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        '<!DOCTYPE html><html><body><h1>Authorization received</h1><p>You can close this tab and return to the terminal.</p></body></html>'
      );
      server.close();
      resolve(code.trim());
    });

    const timeoutId = setTimeout(() => {
      try {
        server.close();
      } catch (_) {}
      reject(
        new Error(`Timed out after ${Math.round(timeoutMs / 60000)} minutes waiting for OAuth redirect.`)
      );
    }, timeoutMs);

    server.on('error', (e) => {
      clearTimeout(timeoutId);
      reject(e);
    });

    // Bind all interfaces so "localhost" (IPv4 or IPv6) can reach us on Windows.
    server.listen(port, '0.0.0.0', () => {
      console.log(`\n[Temporary server] listening on port ${port} for path ${expectedPath || '/'}`);
      console.log('  Try: http://127.0.0.1:' + port + (expectedPath || '/') + ' (same as localhost)\n');
      try {
        if (typeof onListening === 'function') onListening();
      } catch (e) {
        clearTimeout(timeoutId);
        server.close();
        reject(e);
      }
    });
  });
}

async function simpleOAuth() {
  loadGoogleEnvFromDotfiles();
  console.log('Simple Google OAuth setup (Gmail read-only)');
  if (verbose) console.log('Verbose logging on (--verbose)\n');
  else console.log('Tip: if something fails, run: node scripts/simple-oauth.js --verbose\n');

  const defaultRedirect = 'http://localhost:8080/callback';
  const rawRedirect = (process.env.GOOGLE_REDIRECT_URI || '').trim();
  const redirectUri = rawRedirect || defaultRedirect;
  const redirectFromEnv = Boolean(rawRedirect);

  if (redirectFromEnv) {
    console.log('Using GOOGLE_REDIRECT_URI from .env / .env.local:');
  } else {
    console.log('GOOGLE_REDIRECT_URI not in .env; using default:');
  }
  console.log(`  ${redirectUri}\n`);
  console.log('This exact URL must be under Authorized redirect URIs for this OAuth client.');
  console.log('Use the same GOOGLE_REDIRECT_URI in production when refreshing tokens.\n');

  const clientId =
    (process.env.GOOGLE_CLIENT_ID || '').trim() ||
    (await question('Enter your Google Client ID: '));
  const clientSecret =
    (process.env.GOOGLE_CLIENT_SECRET || '').trim() ||
    (await question('Enter your Google Client Secret: '));

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

  // include_granted_scopes: false avoids incremental authorization quirks that sometimes drop refresh_token.
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    prompt: 'consent',
    include_granted_scopes: false,
  });

  if (verbose) {
    const u = new URL(authUrl);
    const sc = u.searchParams.get('scope') || '';
    console.log('[debug] authorize URL params:', {
      access_type: u.searchParams.get('access_type'),
      prompt: u.searchParams.get('prompt'),
      include_granted_scopes: u.searchParams.get('include_granted_scopes'),
      scope: sc.length > 70 ? `${sc.slice(0, 70)}...` : sc,
    });
  }

  console.log('\nIn Google Cloud Console -> APIs & Services -> Credentials:');
  console.log(`  Add this Authorized redirect URI: ${redirectUri}`);
  console.log('  (Then save.)\n');

  console.log('IMPORTANT (or Google often omits refresh_token):');
  console.log('  1) Open https://myaccount.google.com/permissions');
  console.log('  2) Find this app and REMOVE its access (all accounts you use for Gmail).');
  console.log('  3) When the script prints the Google link, open it in an INCOGNITO / Private window.');
  console.log('  4) If the app is in "Testing" on the OAuth consent screen, your Gmail must be a Test user.\n');

  await question('Press Enter here AFTER it is saved in Google Cloud... ');

  let authCode;

  if (isLocalRedirect(redirectUri)) {
    authCode = await waitForOAuthCallback(redirectUri, () => {
      console.log('Open this URL in your browser (sign in and allow access):\n');
      console.log(authUrl);
      console.log('');
    });
  } else {
    console.log('\nOpen this URL in your browser:');
    console.log(authUrl);
    console.log("\nAfter redirect, copy the authorization code from the URL's query string.");
    authCode = (await question('\nEnter the authorization code: ')).trim();
  }

  try {
    const raw = await exchangeAuthorizationCodeForTokens({
      clientId,
      clientSecret,
      redirectUri,
      code: authCode,
    });

    console.log('\nGoogle token endpoint returned these fields:', Object.keys(raw).join(', '));

    if (!raw.refresh_token) {
      console.error('\n*** Google did NOT return refresh_token ***\n');
      console.error('That is normal if Google still considers this app "already authorized" for your account.');
      console.error('Do ALL of the following, then run this script again from the start:\n');
      console.error('  - Remove the app: https://myaccount.google.com/permissions');
      console.error('  - Use an Incognito/Private window for the Google link.');
      console.error('  - Confirm OAuth consent screen includes scope gmail.readonly and you are a Test user if status is Testing.');
      console.error('  - Optional: create a NEW OAuth Client ID (Desktop or Web), update .env client id/secret, re-run.\n');
      if (verbose) {
        console.error('[debug] token response (no secrets):', {
          token_type: raw.token_type,
          expires_in: raw.expires_in,
          scope: raw.scope,
        });
      }
      rl.close();
      process.exit(1);
    }

    console.log('\nSuccess. Add or update these lines in .env (or .env.local):');
    console.log(`GOOGLE_REDIRECT_URI=${redirectUri}`);
    console.log(`GOOGLE_REFRESH_TOKEN=${raw.refresh_token}`);
    console.log('\nThen run: npm run verify:gmail-oauth');
    console.log('Then restart: npm run dev');
  } catch (error) {
    console.error('\nError exchanging code for tokens:', error.message);
    if (error.google) {
      console.error('Google JSON:', JSON.stringify(error.google, null, 2));
    }
    if (error.response?.data) {
      console.error('Google response:', JSON.stringify(error.response.data, null, 2));
    }
    console.log('\nCheck: redirect URI matches Google Cloud exactly; client ID/secret match that client;');
    console.log('OAuth consent screen has gmail.readonly scope; your Google account is a Test user if app is in Testing.');
  }

  rl.close();
}

/**
 * Direct POST to Google's token endpoint so we can see exactly what comes back.
 * (Same as google-auth-library getToken, but explicit for debugging.)
 */
async function exchangeAuthorizationCodeForTokens({ clientId, clientSecret, redirectUri, code }) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error_description || data.error || `HTTP ${res.status}`);
    err.google = data;
    throw err;
  }
  return data;
}

simpleOAuth().catch((err) => {
  console.error(err);
  rl.close();
  process.exit(1);
});
