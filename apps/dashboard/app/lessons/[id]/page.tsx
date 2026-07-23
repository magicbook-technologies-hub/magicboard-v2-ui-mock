import { LessonPageClient } from './LessonPageClient';

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <LessonPageClient id={id} />;
}
