// pages/_app.js
import "../styles/globals.css";
import Layout from "../components/layout";
import Head from "next/head";
import { useState } from "react";
import SplashScreen from "../components/splashscreen";

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
<SplashScreen onFinish={() => setShowSplash(false)} />
) : (
<Layout show={!showSplash}>
<Component {...pageProps} show={!showSplash} />
</Layout>
)}
    </>
  );
}
