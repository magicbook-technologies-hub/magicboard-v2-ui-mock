'use client';

import { Bot, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export function AssistantWidget({ lessonTitle }: { lessonTitle: string }) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text:
        locale === 'en'
          ? `I can help you teach "${lessonTitle}". Ask about BNCC, activities, or assessment.`
          : `Posso ajudar a ensinar "${lessonTitle}". Pergunte sobre BNCC, atividades ou avaliação.`,
    },
  ]);

  function send() {
    const msg = input.trim();
    if (!msg) return;
    setInput('');
    setMessages((m) => [
      ...m,
      { role: 'user', text: msg },
      {
        role: 'assistant',
        text:
          msg.toLowerCase().includes('bncc')
            ? 'Relacione cada objetivo a uma evidência observável e cite a habilidade BNCC no relatório pedagógico.'
            : 'Revise o roteiro (Conectar → Expandir), escolha uma atividade em destaque e feche com o exit check.',
      },
    ]);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-24 right-6 z-40 flex h-[380px] w-[340px] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 bg-[var(--primary)] px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot size={16} />
                <span className="text-sm font-semibold">{t('assistantTitle')}</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-2 overflow-y-auto p-3 scrollbar-thin">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'ml-auto bg-[var(--primary)] text-white'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-zinc-100 p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder={t('assistantPlaceholder')}
                className="flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm focus:border-[var(--ring)] focus:outline-none"
              />
              <button
                onClick={send}
                className="rounded-xl bg-[var(--primary)] px-3 text-white hover:bg-[var(--primary-hover)]"
                aria-label="Send"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        layout
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/25"
        aria-label={t('assistantTitle')}
      >
        <Bot size={18} />
        <span className="hidden sm:inline">
          {t('assistantTitle')} — {t('assistantHint')}
        </span>
      </motion.button>
    </>
  );
}
