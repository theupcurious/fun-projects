'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { GradientBg } from '@/components/gradient-bg';
import { getHighScore } from '@/lib/storage';

export default function StartPage() {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    setHighScore(getHighScore());
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12">
      <GradientBg />

      <div className="relative z-10 mx-auto flex w-full max-w-xl flex-col items-center rounded-3xl border border-white/20 bg-black/25 p-8 text-center backdrop-blur-xl sm:p-10">
        <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/60">Upcurious Presents</p>
        <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl">Gradient</h1>
        <p className="mt-4 max-w-md text-sm text-white/75 sm:text-base">
          Tap the one tile that is slightly different. The grid gets bigger and the color difference gets harder.
        </p>

        <Link
          href="/play"
          className="mt-10 inline-flex min-h-14 min-w-56 items-center justify-center rounded-full border border-white/60 bg-white px-10 py-4 text-lg font-semibold text-black transition hover:scale-[1.02] hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          Play
        </Link>

        <div className="mt-8 text-sm text-white/80">
          High Score: <span className="font-semibold text-white">{highScore}</span>
        </div>
      </div>

      <a
        className="absolute bottom-5 z-10 text-xs tracking-[0.2em] text-white/65 transition hover:text-white"
        href="https://theupcurious.com"
        target="_blank"
        rel="noreferrer"
      >
        by Upcurious
      </a>
    </main>
  );
}
