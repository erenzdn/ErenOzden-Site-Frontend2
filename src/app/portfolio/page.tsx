import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Portfolio from "@/components/sections/Portfolio";

export const metadata = {
  title: "Projeler | Eren Özden",
  description: "Tamamladığım web, mobil ve backend projeleri.",
};

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <Portfolio />
      </main>
      <Footer />
    </>
  );
}
