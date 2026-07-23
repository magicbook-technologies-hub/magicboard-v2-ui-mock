'use client';

import { ArrowLeft, Presentation, X } from 'lucide-react';
import type { Artifact } from '@magicboard/schema';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';

export function ArtifactPanel({
  artifact,
  onClose,
  onPresent,
}: {
  artifact: Artifact;
  onClose: () => void;
  onPresent?: () => void;
}) {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal>
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl">
        <header className="flex items-center gap-3 border-b border-zinc-100 px-5 py-3">
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-zinc-100" aria-label="Close">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wide text-zinc-400">{artifact.tool}</p>
            <h2 className="truncate text-base font-semibold text-zinc-900">{artifact.title}</h2>
          </div>
          {artifact.tool === 'slides' && onPresent && (
            <Button variant="primary" size="sm" onClick={onPresent}>
              <Presentation size={14} />
              {t('presentSlides')}
            </Button>
          )}
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-zinc-100" aria-label="Close">
            <X size={16} />
          </button>
        </header>
        <pre className="flex-1 overflow-auto bg-zinc-50 p-5 text-[12px] leading-relaxed text-zinc-700 scrollbar-thin">
          {JSON.stringify(artifact.payload, null, 2)}
        </pre>
        <p className="border-t border-zinc-100 px-5 py-2 text-[11px] text-zinc-400">
          Mock artifact from Express · {new Date(artifact.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
