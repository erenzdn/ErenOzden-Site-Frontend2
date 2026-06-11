import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import About from "@/components/sections/About";

export const metadata = {
  title: "Hakkımda | Eren Özden",
  description: "Eren Özden hakkında detaylı bilgi, yetenekler ve deneyimler.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-24 min-h-screen">
        <About />
      </main>
      <Footer />
    </>
  );
}
