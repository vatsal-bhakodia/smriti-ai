import Footer from "@/components/Footer";
import Navbar from "./navbar";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="pt-18">
        {children}
        <Footer />
      </main>
    </>
  );
}
