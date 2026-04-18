/**
 * Prints step-by-step instructions for getting GOOGLE_REFRESH_TOKEN via
 * Google OAuth 2.0 Playground. Use this when localhost + npm run oauth-simple
 * never returns a refresh_token.
 *
 * Run: npm run oauth-playground-guide
 */

const text = `
================================================================================
GET A GMAIL REFRESH TOKEN VIA GOOGLE OAUTH 2.0 PLAYGROUND
================================================================================

This path uses Google's own site as the redirect URL. It often works when
http://localhost:8080/callback never gives you a refresh_token.

PART 1 - Google Cloud (same project where Gmail API is enabled)
--------------------------------------------------------------------------------
1) APIs & Services -> Credentials -> your OAuth 2.0 Client ID (type: Web application).

2) Under "Authorized redirect URIs", ADD this EXACT URI (keep localhost too if you want):

    https://developers.google.com/oauthplayground

3) Save.

PART 2 - OAuth 2.0 Playground
--------------------------------------------------------------------------------
1) Open: https://developers.google.com/oauthplayground/

2) Click the gear icon (OAuth 2.0 configuration) top right.

3) Turn ON: "Use your own OAuth credentials"

4) Paste your Client ID and Client Secret from Google Cloud. Close the dialog.

5) In the left "Step 1" list, scroll to Gmail API v1 and check:

    https://www.googleapis.com/auth/gmail.readonly

   (Or search "gmail" in the filter box.)

6) Click "Authorize APIs". Sign in with the Gmail account that receives deals.
   Approve. You should return to the Playground.

7) Click "Exchange authorization code for tokens" (Step 2).

8) In the JSON on the right, copy the value of "refresh_token" (long string).

PART 3 - Your laflight .env (must match how the token was minted)
--------------------------------------------------------------------------------
Set ALL of these (same Client ID / Secret as in the Playground):

    GOOGLE_CLIENT_ID=...your client id...
    GOOGLE_CLIENT_SECRET=...your client secret...
    GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground
    GOOGLE_REFRESH_TOKEN=...paste refresh_token from Playground, one line...

IMPORTANT: GOOGLE_REDIRECT_URI must be EXACTLY the Playground URL above.
Your app uses this same redirect when refreshing the token (see src/lib/gmail.ts).

PART 4 - Verify
--------------------------------------------------------------------------------
From the project folder:

    npm run verify:gmail-oauth

You should see OK for token refresh and Gmail labels.list.

Then restart: npm run dev

================================================================================
If Playground Step 2 has no refresh_token: revoke the app at
https://myaccount.google.com/permissions then repeat from Part 2 step 6.
================================================================================
`;

console.log(text);
