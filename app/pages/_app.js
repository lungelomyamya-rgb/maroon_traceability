// src/pages/_app.js
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Handle client-side routing with base path
    if (typeof window !== 'undefined' && window.location.pathname.includes('/_next')) {
      router.replace(window.location.pathname.replace(/\/_next\/?/, ''));
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;