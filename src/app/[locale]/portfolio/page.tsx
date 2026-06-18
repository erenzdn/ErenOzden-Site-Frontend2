import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Portfolio from '@/components/sections/Portfolio';
import { locales, type Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.portfolio' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

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
