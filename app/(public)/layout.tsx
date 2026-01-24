import Footer from "@/components/Footer";
import Navbar from "./navbar";
import Script from "next/script";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9010517429426777"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Navbar />
      <main className="pt-18">
        {children}
        <Footer />
      </main>
    </>
  );
}
