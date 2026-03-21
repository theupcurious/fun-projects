type ScoreBarProps = {
  score: number;
  level: number;
  lives: number;
  maxLives?: number;
};

export function ScoreBar({ score, level, lives, maxLives = 3 }: ScoreBarProps) {
  return (
    <div className="grid grid-cols-3 items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-4 py-3 text-sm backdrop-blur-lg sm:text-base">
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Score</p>
        <p className="text-lg font-semibold text-white sm:text-xl">{score}</p>
      </div>

      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Level</p>
        <p className="text-lg font-semibold text-white sm:text-xl">{level}</p>
      </div>

      <div className="justify-self-end text-right">
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Lives</p>
        <div className="mt-2 flex justify-end gap-1.5">
          {Array.from({ length: maxLives }, (_, index) => {
            const alive = index < lives;

            return (
              <span
                key={index}
                className={`h-2.5 w-2.5 rounded-full transition ${alive ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)]' : 'bg-white/20'}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
