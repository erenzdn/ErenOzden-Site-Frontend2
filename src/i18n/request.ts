import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing, type Locale } from './routing';

/**
 * Request-scoped i18n yapılandırması
 * Her sunucu isteğinde çalışır ve ilgili locale için mesajları yükler
 * 
 * Bu fonksiyon next-intl plugin tarafından otomatik olarak çağrılır
 * ve Server Components'ta getTranslations/useTranslations için gerekli context'i sağlar
 */
export default getRequestConfig(async ({ requestLocale }) => {
  // URL'den gelen locale değerini al (örn: /tr/about → 'tr')
  const requested = await requestLocale;

  // Geçerli bir locale mi kontrol et, değilse defaultLocale'e fallback
  const locale: Locale = hasLocale(routing.locales, requested)
    ? (requested as Locale)
    : routing.defaultLocale;

  // Dinamik import ile sadece gerekli dil dosyasını yükle
  // Bu sayede tüm diller bundle'a eklenmez, sadece aktif dil yüklenir
  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    // Opsiyonel: Tarih/saat formatları için timeZone
    timeZone: 'Europe/Istanbul',
    // Opsiyonel: Sayı/para birimi formatları
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
        long: {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'long',
        },
      },
      number: {
        currency: {
          style: 'currency',
          currency: locale === 'tr' ? 'TRY' : 'USD',
        },
      },
    },
  };
});
