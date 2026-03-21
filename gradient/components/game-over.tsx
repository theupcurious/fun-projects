'use client';

import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import { ShareCard } from '@/components/share-card';

type GameOverProps = {
  score: number;
  levelsReached: number;
  bestStreak: number;
  accuracy: number;
  highScore: number;
  isNewHigh: boolean;
  swatchA: string;
  swatchB: string;
  shareUrl: string;
  onRestart: () => void;
};

type ShareStatus = 'idle' | 'copying' | 'done-image' | 'done-link' | 'failed';

async function copyTextFallback(text: string): Promise<boolean> {
  if (!navigator?.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function GameOver({
  score,
  levelsReached,
  bestStreak,
  accuracy,
  highScore,
  isNewHigh,
  swatchA,
  swatchB,
  shareUrl,
  onRestart
}: GameOverProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');

  const shareText = useMemo(() => `I scored ${score} on Gradient. Play here: ${shareUrl}`, [score, shareUrl]);

  const resetShareStatus = () => {
    window.setTimeout(() => {
      setShareStatus('idle');
    }, 2200);
  };

  const onShare = async () => {
    setShareStatus('copying');

    if (!cardRef.current) {
      const copied = await copyTextFallback(shareText);
      setShareStatus(copied ? 'done-link' : 'failed');
      resetShareStatus();
      return;
    }

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#0b1221'
      });

      const imageResponse = await fetch(dataUrl);
      const blob = await imageResponse.blob();
      const canCopyImage =
        typeof navigator !== 'undefined' &&
        'clipboard' in navigator &&
        typeof ClipboardItem !== 'undefined';

      if (canCopyImage) {
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        await copyTextFallback(shareText);
        setShareStatus('done-image');
      } else {
        const copied = await copyTextFallback(shareText);
        setShareStatus(copied ? 'done-link' : 'failed');
      }
    } catch {
      const copied = await copyTextFallback(shareText);
      setShareStatus(copied ? 'done-link' : 'failed');
    }

    resetShareStatus();
  };

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-950/85 p-6 text-white shadow-2xl sm:p-8"
        initial={{ y: 24, scale: 0.98, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 16, scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-xs uppercase tracking-[0.25em] text-white/60">Game Over</p>
        <h2 className="mt-2 text-5xl font-bold leading-none">{score}</h2>

        <div className="mt-5 grid grid-cols-2 gap-4 text-sm text-white/85">
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Levels</p>
            <p className="mt-1 text-xl font-semibold text-white">{levelsReached}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Best Streak</p>
            <p className="mt-1 text-xl font-semibold text-white">{bestStreak}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">Accuracy</p>
            <p className="mt-1 text-xl font-semibold text-white">{accuracy}%</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">High Score</p>
            <p className="mt-1 text-xl font-semibold text-white">{highScore}</p>
          </div>
        </div>

        {isNewHigh ? (
          <p className="mt-4 rounded-xl border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-200">
            New high score.
          </p>
        ) : null}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onShare}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/40 bg-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/25"
          >
            {shareStatus === 'copying'
              ? 'Sharing...'
              : shareStatus === 'done-image'
                ? '✓ Image + link copied'
                : shareStatus === 'done-link'
                  ? '✓ Link copied'
                  : shareStatus === 'failed'
                    ? 'Copy failed'
                    : 'Share'}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-xl border border-white/70 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
          >
            Play Again
          </button>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute -left-[9999px] top-0">
        <ShareCard
          ref={cardRef}
          score={score}
          levelsReached={levelsReached}
          bestStreak={bestStreak}
          swatchA={swatchA}
          swatchB={swatchB}
          shareUrl={shareUrl}
        />
      </div>
    </motion.div>
  );
}
