import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Services from "@/components/sections/Services";

export const metadata = {
  title: "Hizmetler | Eren Özden",
  description: "Web, mobil ve backend geliştirme hizmetlerim.",
};

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen flex flex-col">
        <Services />
      </main>
      <Footer />
    </>
  );
}
