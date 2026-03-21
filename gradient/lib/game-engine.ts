import { generateGrid, type GeneratedGrid } from '@/lib/color-utils';

export type LevelConfig = {
  gridSize: number;
  colorDelta: number;
};

const DIFFICULTY_TABLE: Array<{ maxLevel: number; config: LevelConfig }> = [
  { maxLevel: 5,  config: { gridSize: 3, colorDelta: 12 } },
  { maxLevel: 10, config: { gridSize: 4, colorDelta: 10 } },
  { maxLevel: 15, config: { gridSize: 4, colorDelta: 7  } },
  { maxLevel: 20, config: { gridSize: 5, colorDelta: 5  } },
  { maxLevel: 30, config: { gridSize: 5, colorDelta: 3  } },
  { maxLevel: 40, config: { gridSize: 6, colorDelta: 3  } },
  { maxLevel: 55, config: { gridSize: 6, colorDelta: 2  } },
  { maxLevel: 70, config: { gridSize: 7, colorDelta: 2  } },
];

export const getLevel = (level: number): LevelConfig => {
  const row = DIFFICULTY_TABLE.find((entry) => level <= entry.maxLevel);
  if (row) {
    return row.config;
  }

  // True endgame: 8×8 grid, near-imperceptible delta
  return { gridSize: 8, colorDelta: 2 };
};

export const createRound = (level: number): GeneratedGrid => {
  const { gridSize, colorDelta } = getLevel(level);
  return generateGrid(gridSize, colorDelta);
};

export const calculateScore = (level: number, timeMs: number, streak: number): number => {
  const basePoint = 10;
  const timeMultiplier = timeMs <= 1000 ? 1.5 : timeMs <= 2000 ? 1.2 : 1;
  const streakBonus = Math.max(streak, 0) * 5;

  const levelFactor = Math.min(1.4, 1 + level * 0.01);
  return Math.max(10, Math.round(basePoint * timeMultiplier * levelFactor + streakBonus));
};
