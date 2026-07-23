'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, FileText, Image as ImageIcon, Shapes, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ContentSection } from '@/data/lesson';
import { SectionHeader } from '@/components/lesson/SectionHeader';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const MEDIA_ICON = {
  text: FileText,
  image: ImageIcon,
  video: Video,
  diagram: Shapes,
};

export function LessonCarousel({ sections }: { sections: ContentSection[] }) {
  const { t } = useI18n();
  const [emblaRef, embla] = useEmblaCarousel({ align: 'start', dragFree: true });

  const filters = [
    t('filterText'),
    t('filterImages'),
    t('filterVideos'),
    t('filterDiagrams'),
    t('filterExamples'),
    t('filterQuestions'),
  ];

  return (
    <section id="content">
      <SectionHeader title={t('completeContent')} />
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {sections.map((s) => (
              <motion.article
                key={s.id}
                whileHover={{ y: -4 }}
                className="min-w-[220px] max-w-[220px] shrink-0 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm"
              >
                <div className={cn('h-28 bg-gradient-to-br', s.gradient)} />
                <div className="p-3.5">
                  <p className="text-[10px] font-semibold text-zinc-400">{s.number}</p>
                  <h3 className="mt-1 text-[13px] font-semibold text-zinc-900 line-clamp-2">{s.title}</h3>
                  <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                  <p className="mt-3 text-[11px] text-zinc-400">
                    {t('minReading', { n: s.readingMinutes })}
                  </p>
                  <div className="mt-2 flex gap-1.5 text-zinc-400">
                    {s.mediaKinds.map((k) => {
                      const Icon = MEDIA_ICON[k];
                      return <Icon key={k} size={12} />;
                    })}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
        <button
          onClick={() => embla?.scrollPrev()}
          className="absolute -left-2 top-1/3 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm"
          aria-label="Previous"
        >
          <ChevronLeft size={14} />
        </button>
        <button
          onClick={() => embla?.scrollNext()}
          className="absolute -right-2 top-1/3 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm"
          aria-label="Next"
        >
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-medium text-zinc-600 hover:border-[var(--ring)] hover:bg-[var(--primary-soft)]"
          >
            {f}
          </button>
        ))}
      </div>
    </section>
  );
}
