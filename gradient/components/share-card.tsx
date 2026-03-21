import { forwardRef } from 'react';

type ShareCardProps = {
  score: number;
  levelsReached: number;
  bestStreak: number;
  swatchA: string;
  swatchB: string;
  shareUrl: string;
};

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard(
  { score, levelsReached, bestStreak, swatchA, swatchB, shareUrl },
  ref
) {
  return (
    <div
      ref={ref}
      className="w-[560px] rounded-3xl border border-white/20 bg-[#0b1221] p-9 text-white"
      style={{
        fontFamily: 'var(--font-body), sans-serif',
        backgroundImage: 'radial-gradient(circle at top right, rgba(255,255,255,0.14), transparent 42%)'
      }}
    >
      <p className="text-[11px] uppercase tracking-[0.3em] text-white/70">Upcurious</p>
      <h2 className="mt-2 text-5xl font-bold" style={{ fontFamily: 'var(--font-display), monospace' }}>
        Gradient
      </h2>

      <div className="mt-7 overflow-hidden rounded-2xl border border-white/20">
        <div
          className="h-36 w-full"
          style={{
            background: `linear-gradient(120deg, ${swatchA}, ${swatchB})`
          }}
        />
      </div>

      <div className="mt-7 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/70">Score</p>
          <p className="text-6xl font-bold leading-none">{score}</p>
        </div>
        <div className="text-right text-sm text-white/85">
          <p>Levels: {levelsReached}</p>
          <p>Best streak: {bestStreak}</p>
        </div>
      </div>

      <p className="mt-8 text-sm text-white/75">Play Gradient - {shareUrl}</p>
    </div>
  );
});
