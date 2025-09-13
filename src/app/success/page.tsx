'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (sessionId) {
      // Verify the session with Stripe
      fetch(`/api/verify-session?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsLoading(false);
            // Auto-redirect to deals page after 3 seconds
            const countdownInterval = setInterval(() => {
              setCountdown(prev => {
                if (prev <= 1) {
                  clearInterval(countdownInterval);
                  window.location.href = '/deals';
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            setError(data.error || 'Payment verification failed');
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.error('Verification error:', err);
          // Even if verification fails, redirect to deals page
          setIsLoading(false);
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                window.location.href = '/deals';
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        });
    } else {
      // No session ID, just redirect to deals page
      setIsLoading(false);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            window.location.href = '/deals';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-red-600 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a 
            href="/pricing" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="text-green-600 text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Premium!</h1>
        <p className="text-gray-600 mb-6">
          Your subscription is now active. You'll receive your first premium digest next Sunday with all the best flight deals!
        </p>
        <p className="text-blue-600 font-semibold mb-6">
          Redirecting to deals page in {countdown} seconds...
        </p>
        
        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
          <ul className="text-left space-y-2 text-gray-600">
            <li>• Check your email for confirmation</li>
            <li>• Visit the <a href="/deals" className="text-blue-600 underline">deals page</a> to see all current deals</li>
            <li>• Your first premium digest arrives next Sunday</li>
            <li>• Manage your subscription anytime from your account</li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <a 
            href="/deals" 
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View All Deals Now
          </a>
          <a 
            href="/" 
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
