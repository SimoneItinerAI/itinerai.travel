import Navbar from "./Navbar";

export default function Layout({ children, show }) {
  return (
    <>
      <Navbar show={show} />
      <main>{children}</main>
      <footer
        style={{
          padding: 20,
          textAlign: "center",
          background: "#0f172a",
          color: "#fff",
          marginTop: 40,
        }}
      >
        © {new Date().getFullYear()} ItinerAI
      </footer>
    </>
  );
}
