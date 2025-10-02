import { useState, useEffect } from "react";

export default function AutocompleteInput({ value, setValue, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [cities, setCities] = useState([]);

  // Carica dati dal JSON se disponibile
  useEffect(() => {
    fetch("/airports.json")
      .then((res) => {
        if (!res.ok) throw new Error("File airports.json non trovato");
        return res.json();
      })
      .then((data) => setCities(data))
      .catch((err) => {
        console.warn("⚠️ Autocomplete fallback:", err.message);
        // fallback minimo per non crashare
        setCities([
          { city: "Roma", airport: "Fiumicino", code: "FCO" },
          { city: "Milano", airport: "Malpensa", code: "MXP" },
          { city: "Parigi", airport: "Charles de Gaulle", code: "CDG" },
          { city: "Tokyo", airport: "Narita", code: "NRT" },
        ]);
      });
  }, []);

  const handleChange = (e) => {
    const input = e.target.value;
    setValue(input);

    if (input.length > 1) {
      const filtered = cities.filter((c) =>
        c.city.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5)); // max 5 suggerimenti
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (s) => {
    setValue(`${s.city} – ${s.airport} (${s.code})`);
    setSuggestions([]);
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
  type="text"
  value={value}
  placeholder={placeholder}
  onChange={handleChange}
  style={{
    width: "100%",
    padding: "14px 16px", // più spazio interno
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem", // testo più grande
    color: "#111", // nero leggibile dentro il campo
  }}
/>

{suggestions.length > 0 && (
  <ul
    style={{
      position: "absolute",
      top: "48px", // più in basso
      left: 0,
      right: 0,
      background: "#fff",
      color: "#000",
      listStyle: "none",
      margin: 0,
      padding: "5px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      zIndex: 20,
      maxHeight: "200px", // altezza massima
      overflowY: "auto",  // scroll se troppi risultati
      fontSize: "0.95rem"
    }}
  >
    {suggestions.map((s, i) => (
      <li
        key={i}
        onClick={() => selectSuggestion(s)}
        style={{
          padding: "8px",
          cursor: "pointer",
          borderBottom: "1px solid #eee"
        }}
      >
        {s.city} – {s.airport} ({s.code})
      </li>
    ))}
  </ul>
)}
    </div>
  );
}
