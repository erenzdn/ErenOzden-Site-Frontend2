import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Contact from "@/components/sections/Contact";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <Contact />
      </main>
      <Footer />
    </>
  );
}
