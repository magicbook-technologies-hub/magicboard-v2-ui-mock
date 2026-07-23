'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Download,
  MoreVertical,
  Presentation,
  Search,
  Share2,
} from 'lucide-react';
import { useI18n, type Locale } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

export function Topbar({
  onPresent,
  onDownload,
  onShare,
}: {
  onPresent: () => void;
  onDownload: () => void;
  onShare: () => void;
}) {
  const { t, locale, setLocale } = useI18n();

  return (
    <header className="shrink-0 border-b border-zinc-200/80 bg-white">
      <div className="flex items-center gap-4 px-5 py-3">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('backToLessons')}
        </Link>

        <div className="relative mx-auto w-full max-w-md">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            aria-label={t('searchPlaceholder')}
            placeholder={t('searchPlaceholder')}
            className="h-9 w-full rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-14 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[var(--ring)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--ring)]/40"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] text-zinc-400">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-zinc-200 p-0.5 text-[11px] font-medium">
            {(['pt', 'en'] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`rounded-md px-2 py-1 uppercase ${
                  locale === l ? 'bg-[var(--primary-soft)] text-[var(--primary)]' : 'text-zinc-400'
                }`}
                aria-label={`${t('locale')} ${l}`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            className="relative rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
          </button>
          <button className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-zinc-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xs font-semibold text-white">
              T
            </span>
            <span className="hidden text-sm font-medium text-zinc-700 sm:inline">{t('professor')}</span>
            <ChevronDown size={14} className="text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 pb-3">
        <Button variant="secondary" size="sm" onClick={onPresent}>
          <Presentation size={14} />
          {t('presentSlides')}
        </Button>
        <Button variant="secondary" size="sm" onClick={onShare}>
          <Share2 size={14} />
          {t('share')}
        </Button>
        <Button variant="primary" size="sm" onClick={onDownload}>
          <Download size={14} />
          {t('download')}
        </Button>
        <button className="ml-auto rounded-lg p-2 text-zinc-400 hover:bg-zinc-100" aria-label="More">
          <MoreVertical size={16} />
        </button>
      </div>
    </header>
  );
}
