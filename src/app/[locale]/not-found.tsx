import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

/**
 * 404 Not Found Sayfası
 * Locale-aware ve çevrilebilir
 */
export default function NotFound() {
  const t = useTranslations('common');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white px-6">
      <h1 className="text-8xl font-heading font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-heading font-semibold mb-4">
        {t('notFound')}
      </h2>
      <p className="text-gray-text mb-8 text-center max-w-md">
        Aradığınız sayfa bulunamadı veya taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-dark font-semibold rounded-full hover:bg-primary/90 transition-colors"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
