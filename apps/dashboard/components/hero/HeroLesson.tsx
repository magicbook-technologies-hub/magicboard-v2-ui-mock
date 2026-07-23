'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

const HERO_SRC =
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=80';

export function HeroLesson({
  title,
  subtitle,
  badges,
}: {
  title: string;
  subtitle: string;
  badges: string[];
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl min-h-[220px] shadow-sm"
    >
      <Image
        src={HERO_SRC}
        alt=""
        fill
        priority
        className="object-cover"
        sizes="(max-width: 1200px) 100vw, 800px"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
      <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8 min-h-[220px]">
        <Badge tone="green" className="w-fit mb-3">
          {badges[0] || 'Ciências'}
        </Badge>
        <h1 className="max-w-2xl text-2xl md:text-3xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/85 leading-relaxed">{subtitle}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.slice(1).map((b) => (
            <Badge key={b} tone="neutral">
              {b}
            </Badge>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
