import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <div className="beta-tag">
        <span>BETA</span>
      </div>
    </>
  );
}
