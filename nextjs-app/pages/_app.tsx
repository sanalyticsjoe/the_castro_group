
import '../app/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [index, setIndex] = useState(0);

  return (
    <Layout index={index} setIndex={setIndex}>
      <Component {...pageProps} index={index} setIndex={setIndex} />
    </Layout>
  );
}

export default MyApp;
