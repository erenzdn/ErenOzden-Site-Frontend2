import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/routing';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function LegacyPortfolioDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/${defaultLocale}/portfolio/${id}`);
}
