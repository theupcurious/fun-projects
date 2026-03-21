'use client';

import { motion } from 'framer-motion';

type TileState = 'idle' | 'correct' | 'wrong';

type ColorTileProps = {
  color: string;
  index: number;
  disabled?: boolean;
  state?: TileState;
  onSelect: (index: number) => void;
};

export function ColorTile({ color, index, disabled = false, state = 'idle', onSelect }: ColorTileProps) {
  return (
    <motion.button
      type="button"
      aria-label={`Tile ${index + 1}`}
      disabled={disabled}
      className="group relative h-full w-full overflow-hidden rounded-xl shadow-tile focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/90 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:cursor-default"
      style={{ backgroundColor: color }}
      animate={
        state === 'correct'
          ? {
              scale: [1, 1.08, 1],
              filter: ['brightness(1)', 'brightness(1.22)', 'brightness(1)']
            }
          : state === 'wrong'
            ? {
                x: [0, -6, 6, -4, 4, 0],
                filter: ['brightness(1)', 'brightness(0.9)', 'brightness(1)']
              }
            : { scale: 1, x: 0, filter: 'brightness(1)' }
      }
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ duration: state === 'wrong' ? 0.35 : 0.3 }}
      onClick={() => onSelect(index)}
    >
      {state === 'correct' ? (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-xl border-2 border-white shadow-[0_0_0_1px_rgba(255,255,255,0.6),0_0_22px_rgba(255,255,255,0.8)]" />
          <motion.span
            className="pointer-events-none absolute inset-0 rounded-xl border border-white/90"
            initial={{ opacity: 0.7, scale: 0.9 }}
            animate={{ opacity: [0.7, 0.2, 0.55], scale: [0.9, 1.05, 1] }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </>
      ) : null}

      {state === 'wrong' ? (
        <motion.span
          className="pointer-events-none absolute inset-0 bg-red-500/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{ duration: 0.32 }}
        />
      ) : null}

      <span className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 via-transparent to-black/[0.18]" />
      <span className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-hover:opacity-100 group-active:opacity-50 bg-white/[0.08]" />
    </motion.button>
  );
}
