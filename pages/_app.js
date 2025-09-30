import "../styles/globals.css";
import Layout from "../components/Layout";
import Head from "next/head";
import { useState } from "react";
import Splashscreen from "../components/Splashscreen";

export default function MyApp({ Component, pageProps }) {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {showSplash ? (
        <Splashscreen onFinish={() => setShowSplash(false)} />
      ) : (
        <Layout show={!showSplash}>
          <Component {...pageProps} show={!showSplash} />
        </Layout>
      )}
    </>
  );
}

