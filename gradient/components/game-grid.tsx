'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ColorTile } from '@/components/color-tile';

type GameGridProps = {
  size: number;
  colors: string[];
  disabled?: boolean;
  correctIndex: number | null;
  wrongIndex: number | null;
  roundKey: string;
  availableWidth?: number;
  availableHeight?: number;
  onSelect: (index: number) => void;
};

export function GameGrid({
  size,
  colors,
  disabled = false,
  correctIndex,
  wrongIndex,
  roundKey,
  availableWidth,
  availableHeight,
  onSelect
}: GameGridProps) {
  const hasBounds = Boolean(availableWidth && availableHeight);
  const gap = size >= 6 ? 6 : size >= 5 ? 8 : 10;
  const width = availableWidth ?? 0;
  const height = availableHeight ?? 0;
  const tileByWidth = hasBounds ? (width - gap * (size - 1)) / size : 0;
  const tileByHeight = hasBounds ? (height - gap * (size - 1)) / size : 0;
  const tileSize = hasBounds ? Math.max(1, Math.floor(Math.min(tileByWidth, tileByHeight))) : 0;
  const gridLength = hasBounds ? tileSize * size + gap * (size - 1) : undefined;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={roundKey}
        className="grid"
        style={
          hasBounds
            ? {
                gridTemplateColumns: `repeat(${size}, ${tileSize}px)`,
                gridTemplateRows: `repeat(${size}, ${tileSize}px)`,
                gap: `${gap}px`,
                width: `${gridLength}px`,
                height: `${gridLength}px`
              }
            : { gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, width: '100%' }
        }
        initial={{ opacity: 0, scale: 0.97, filter: 'blur(2px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 1.03, filter: 'blur(2px)' }}
        transition={{ duration: 0.32, ease: 'easeOut' }}
      >
        {colors.map((color, index) => {
          const tileState = index === correctIndex ? 'correct' : index === wrongIndex ? 'wrong' : 'idle';

          return (
            <ColorTile
              key={`${roundKey}-${index}`}
              color={color}
              index={index}
              disabled={disabled}
              state={tileState}
              onSelect={onSelect}
            />
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
