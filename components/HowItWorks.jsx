import { FaSearch, FaLightbulb, FaPlane } from "react-icons/fa";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <section className={styles.section} id="how-it-works">
      <h2 style={{ fontSize: "2rem", marginBottom: "40px", fontWeight: "700" }}>
        Come funziona ItinerAI
      </h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <FaSearch className={styles.icon} />
          <h3>1. Inserisci la destinazione</h3>
          <p>Scegli la città di partenza e quella di arrivo: voli, hotel ed esperienze.</p>
        </div>

        <div className={styles.card}>
          <FaLightbulb className={styles.icon} />
          <h3>2. Ricevi il tuo itinerario</h3>
          <p>L’AI elabora le migliori combinazioni di viaggio su misura per te.</p>
        </div>

        <div className={styles.card}>
          <FaPlane className={styles.icon} />
          <h3>3. Parti senza pensieri</h3>
          <p>Prenota in pochi clic e vivi un’esperienza unica e personalizzata.</p>
        </div>
      </div>
    </section>
  );
}
