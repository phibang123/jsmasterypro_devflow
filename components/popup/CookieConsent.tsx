'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = Cookies.get('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie consent with 1-year expiration
    Cookies.set('cookie-consent', 'accepted', { expires: 365 });
    setShowConsent(false);
  };

  const declineCookies = () => {
    // Just save the decline choice
    Cookies.set('cookie-consent', 'declined', { expires: 30 });
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white p-4 shadow-lg dark:bg-gray-900">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-dark400_light500 text-center md:text-left">
          We use cookies to enhance your experience. Do you agree to this?
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={declineCookies}
          >
            Decline
          </Button>
          <Button
            className="primary-button-gradient"
            onClick={acceptCookies}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
