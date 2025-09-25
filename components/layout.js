// components/Layout.js
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer style={{
        padding: "20px",
        textAlign: "center",
        background: "#0f172a",
        color: "#fff",
        marginTop: "40px"
      }}>
        © {new Date().getFullYear()} ItinerAI
      </footer>
    </>
  );
}
