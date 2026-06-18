import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/routing';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  redirect(`/${defaultLocale}/services/${slug}`);
}
