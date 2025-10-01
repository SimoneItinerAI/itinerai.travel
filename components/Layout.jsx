// components/Layout.jsx
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children, show }) {
  return (
    <>
      <Navbar show={show} />
      <main>{children}</main>
      <Footer />
    </>
  );
}

