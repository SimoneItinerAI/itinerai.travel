import Head from "next/head";
import Hero from "../components/Hero";
import Newsletter from "../components/Newsletter";
import Destinations from "../components/Destinations";
import HowItWorks from "../components/HowItWorks"
export default function Home({ show }) {
  return (
    <>
      <Head>
        <title>ItinerAI – Itinerari di viaggio intelligenti</title>
        <meta
          name="description"
          content="Trova voli, hotel ed esperienze con l'aiuto di ItinerAI"
        />
      </Head>

      <Hero show={show} />
      <Newsletter />
      <Destinations />
      <HowItWorks />
    </>
  );
}

