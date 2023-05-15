import Navbar from "./Navbar";
import Footer from "./Footer";
import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Racks Community</title>
        <meta
          property="og:title"
          content="Racks Community</title>"
          key="title"
        />
      </Head>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <div className="beta-tag">
        <span>BETA</span>
      </div>
    </>
  );
}
