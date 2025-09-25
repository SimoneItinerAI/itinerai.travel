// components/Hero.js
export default function Hero() {
  return (
    <section style={{
      background: "linear-gradient(to bottom, #0f172a, #1e293b)",
      color: "white",
      textAlign: "center",
      padding: "60px 20px"
    }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>
        Trova il tuo prossimo viaggio con <span style={{ color: "#f97316" }}>ItinerAI</span>
      </h1>
      <p style={{ marginBottom: "32px" }}>Cerca voli, hotel ed esperienze in un click</p>

      <form style={{
        display: "grid",
        gap: "12px",
        maxWidth: "600px",
        margin: "0 auto",
        gridTemplateColumns: "1fr 1fr"
      }}>
        <input type="text" placeholder="Da" style={inputStyle} />
        <input type="text" placeholder="A" style={inputStyle} />
        <input type="date" style={inputStyle} />
        <select style={inputStyle}>
          <option>1 persona</option>
          <option>2 persone</option>
          <option>3 persone</option>
        </select>
        <button type="submit" style={buttonStyle}>Cerca</button>
      </form>
    </section>
  );
}

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  gridColumn: "span 2",
  padding: "14px",
  borderRadius: "6px",
  border: "none",
  background: "#f97316",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};
