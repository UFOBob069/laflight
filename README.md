# Flight Deals Monitor

A production-ready Next.js 14 application that automatically monitors Gmail for flight deal emails, parses them, and sends weekly digest emails.

## Features

- **Automated Gmail Monitoring**: Connects to Gmail via OAuth2 and fetches flight deal emails
- **Smart Parsing**: Extracts route, price, dates, and links from emails using flexible regex patterns
- **Firebase Storage**: Stores deals in Firestore with deduplication
- **Weekly Digest**: Sends automated email digests with top deals
- **Manual Controls**: "Run now" buttons for testing
- **Clean UI**: Responsive web interface to view deals
- **Vercel Deployment**: Ready for production deployment with cron jobs

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Firebase Admin SDK (Firestore)
- Google API Node client (Gmail OAuth2)
- Resend (email service)
- Zod (validation)
- Dayjs (date handling)

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Copy `env.example` to `.env.local` and fill in your values:
   ```bash
   cp env.example .env.local
   ```

   Required variables:
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth2 credentials
   - `GOOGLE_REFRESH_TOKEN`: Long-lived refresh token (obtain via OAuth flow)
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Firebase credentials
   - `RESEND_API_KEY`: Resend API key for emails
   - `EMAIL_FROM` & `EMAIL_TO`: Email addresses for digest
   - `CRON_SECRET`: Random secret for securing cron endpoints

3. **Google OAuth Setup**:
   - Create a Google Cloud project
   - Enable Gmail API
   - Create OAuth2 credentials
   - Run OAuth flow locally to get refresh token

4. **Firebase Setup**:
   - Create Firebase project
   - Generate service account key
   - Create Firestore database
   - Add compound index: `(destination asc, price asc, createdAt desc)`

5. **Gmail Setup**:
   - Create label "Flight Alerts" (or update `GMAIL_LABEL`)
   - Set up filters to auto-label flight deal emails

## Development

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run typecheck # Type check
```

## Deployment

1. **Deploy to Vercel**:
   ```bash
   npx vercel --prod
   ```

2. **Set Environment Variables** in Vercel dashboard

3. **Cron Jobs**: Automatically configured via `vercel.json`:
   - Weekly ingest: Sundays 7:00 AM
   - Weekly digest: Sundays 7:05 AM

## API Endpoints

- `GET /api/deals` - Returns JSON of top deals
- `POST /api/ingest` - Manually trigger email ingestion
- `POST /api/digest` - Manually send digest email

## Usage

1. **Manual Testing**: Use the "Run Ingest Now" and "Send Digest Now" buttons on the home page
2. **View Deals**: Visit `/deals` to see all parsed deals
3. **API Access**: Use `/api/deals` for programmatic access

## Data Model

Deals are stored in Firestore with the following structure:
```typescript
{
  id: string,           // Unique identifier
  messageId: string,    // Gmail message ID
  origin: string,       // Departure city/IATA
  destination: string,  // Arrival city/IATA
  price: number,        // Price in USD
  currency: "USD",      // Always USD
  dates: string,        // Travel dates
  link: string,         // Booking link
  source: "gmail",      // Data source
  subject: string,      // Email subject
  receivedAt: string,   // When email was received
  createdAt: string     // When record was created
}
```

## Security

- Cron endpoints protected with `x-cron-secret` header
- Environment variables for all sensitive data
- Firebase security rules should restrict access

## Troubleshooting

- Check Vercel function logs for cron job issues
- Verify Gmail API quotas and permissions
- Ensure Firebase indexes are created
- Test email parsing with sample emails
