import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PageMain from '@/components/layout/PageMain';
import About from '@/components/sections/About';
import { locales, type Locale } from '@/i18n/routing';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.about' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <PageMain>
        <About />
      </PageMain>
      <Footer />
    </>
  );
}
