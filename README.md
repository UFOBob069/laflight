# Flight Deals Monitor

A freemium flight deals monitoring service that finds and shares the best flight deals with users.

## Features

- **Free Tier**: Top 5 lowest-priced deals with booking links
- **Premium Tier**: All deals, sorting, filtering, and international destinations
- **Email Digest**: Weekly automated email with deals
- **User Authentication**: Firebase Auth for account management
- **Payment Processing**: Stripe integration for subscriptions
- **Admin Dashboard**: Deal management and system monitoring

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Firestore
- **Authentication**: Firebase Auth
- **Payments**: Stripe
- **Email**: Resend
- **Deployment**: Vercel

## Environment Setup

### 1. Copy Environment Variables

```bash
cp env.example .env.local
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication (Email/Password)
4. Create a Firestore database
5. Go to Project Settings → General → Your apps
6. Add a web app and copy the config values

Add to `.env.local`:
```bash
# Firebase Server Configuration (for Firestore)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Firebase Client Configuration (for Auth)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. Stripe Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from Developers → API keys
3. Create a product and price for $20/year subscription
4. Set up webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`

Add to `.env.local`:
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... for production
STRIPE_PRICE_ID=price_... # Your $20/year price ID
STRIPE_WEBHOOK_SECRET=whsec_... # From webhook endpoint settings
```

### 4. Email Setup (Resend)

1. Go to [Resend](https://resend.com/)
2. Create an account and get your API key
3. Verify your domain for sending emails

Add to `.env.local`:
```bash
# Email Configuration
RESEND_API_KEY=re_...
EMAIL_FROM="Flight Deals <deals@yourdomain.com>"
EMAIL_TO=you@yourdomain.com # For admin notifications
```

### 5. Site Configuration

Add to `.env.local`:
```bash
# Site Configuration
SITE_URL=https://yourdomain.com # or http://localhost:3000 for development

# Security
CRON_SECRET=your-random-hex-secret-here # Generate with: openssl rand -hex 32
NEXT_PUBLIC_CRON_SECRET=your-random-hex-secret-here # Same as above
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password-here # For admin dashboard access
```

### 6. Gmail Integration (Optional)

For automated deal ingestion from Gmail:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable Gmail API
3. Create OAuth2 credentials
4. Set up OAuth2 flow to get refresh token

Add to `.env.local`:
```bash
# Google OAuth2 Configuration (Optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
GOOGLE_REFRESH_TOKEN=your-refresh-token

# Gmail Configuration
GMAIL_LABEL=Flight Alerts
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd laflight
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add environment variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from your `.env.local` file

3. **Set up Stripe Webhook**
   - In Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.vercel.app/api/webhooks/stripe`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

4. **Set up Vercel Cron Jobs**
   - In Vercel Dashboard → Functions → Cron Jobs
   - Add job: `0 9 * * 0` (every Sunday at 9 AM) → `/api/digest`

## Usage

### For Users

1. **Sign Up**: Enter email on homepage → Create account with password
2. **View Deals**: See lowest-priced deals with booking links
3. **Upgrade**: Click "Upgrade to Premium" for all deals and features
4. **Manage Account**: Use account management section on deals page

### For Admins

1. **Access Admin**: Go to `/admin` and enter admin password
2. **Run Ingest**: Click "Run Ingest" to fetch new deals
3. **Send Digest**: Click "Send Digest" to send weekly emails
4. **Monitor System**: View deal counts and system status

## API Endpoints

- `POST /api/subscribe` - Subscribe user to email list
- `GET /api/deals` - Get flight deals
- `POST /api/digest` - Send weekly digest email
- `POST /api/ingest` - Fetch new deals from Gmail
- `POST /api/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhooks
- `GET /api/user-subscription` - Get user subscription status

## Database Schema

### Firestore Collections

**subscribers**
```typescript
{
  email: string;
  status: 'active' | 'inactive';
  isPaid: boolean;
  stripeCustomerId?: string;
  createdAt: string;
  lastDigestSent?: string;
}
```

**deals**
```typescript
{
  id: string;
  origin: string;
  destination: string;
  price: number;
  currency: string;
  dates: string;
  link: string;
  airline: string;
  stops: string;
  duration: string;
  route: string;
  discount: string;
  receivedAt: string;
  createdAt: string;
}
```

## Troubleshooting

### Common Issues

1. **Firebase Auth not configured**
   - Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set
   - Verify Firebase project has Authentication enabled

2. **Stripe webhook not working**
   - Check webhook endpoint URL is correct
   - Verify webhook secret matches
   - Check Stripe dashboard for webhook delivery logs

3. **Email not sending**
   - Verify Resend API key is correct
   - Check domain is verified in Resend
   - Check `EMAIL_FROM` format

4. **Deals not loading**
   - Check Firestore rules allow read access
   - Verify Firebase service account credentials
   - Check browser console for errors

### Development Tips

- Use `npm run build` to check for build errors
- Check browser console for client-side errors
- Check Vercel function logs for server-side errors
- Use Firebase Console to monitor Firestore activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details