const { google } = require('googleapis');

const CLIENT_ID = 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:3002/api/auth/google/callback';

async function exchangeCode(authCode) {
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  
  try {
    const { tokens } = await oauth2Client.getToken(authCode);
    
    console.log('✅ Success! Your tokens:');
    console.log('Access Token:', tokens.access_token);
    console.log('Refresh Token:', tokens.refresh_token);
    console.log('\n📝 Add this to your .env.local file:');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    
    if (!tokens.refresh_token) {
      console.log('\n⚠️  No refresh token received. Make sure to:');
      console.log('1. Set prompt: "consent" in the auth URL');
      console.log('2. Complete the full OAuth flow');
      console.log('3. Grant all requested permissions');
    }
    
  } catch (error) {
    console.error('❌ Error exchanging code:', error.message);
    console.log('\n💡 Common issues:');
    console.log('- Code expired (try again)');
    console.log('- Wrong redirect URI');
    console.log('- OAuth consent screen not configured');
  }
}

const authCode = process.argv[2];
if (!authCode) {
  console.log('Usage: node scripts/exchange-code.js YOUR_AUTH_CODE');
  process.exit(1);
}

exchangeCode(authCode);
