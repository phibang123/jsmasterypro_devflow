'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

const getCookie = (name: string) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
};

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = getCookie('cookie-consent');
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie consent with 1-year expiration
    setCookie('cookie-consent', 'accepted', 365);
    setShowConsent(false);
  };

  const declineCookies = () => {
    // Just save the decline choice
    setCookie('cookie-consent', 'declined', 30);
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
