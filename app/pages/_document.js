// src/pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <base href={process.env.NEXT_PUBLIC_BASE_PATH || '/'} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}