'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { GameGrid } from '@/components/game-grid';
import { GameOver } from '@/components/game-over';
import { GradientBg } from '@/components/gradient-bg';
import { ScoreBar } from '@/components/score-bar';
import { type GeneratedGrid } from '@/lib/color-utils';
import { calculateScore, createRound } from '@/lib/game-engine';
import { getHighScore, setHighScore as persistHighScore } from '@/lib/storage';

const MAX_LIVES = 3;

type GameStatus = 'playing' | 'gameOver';

type GameState = {
  status: GameStatus;
  level: number;
  score: number;
  lives: number;
  streak: number;
  bestStreak: number;
  attempts: number;
  hits: number;
  roundStartedAt: number;
  round: GeneratedGrid;
};

type Action =
  | { type: 'correct'; reactionMs: number }
  | { type: 'wrong' }
  | { type: 'restart' };

const createInitialState = (): GameState => {
  return {
    status: 'playing',
    level: 1,
    score: 0,
    lives: MAX_LIVES,
    streak: 0,
    bestStreak: 0,
    attempts: 0,
    hits: 0,
    roundStartedAt: Date.now(),
    round: createRound(1)
  };
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'correct': {
      const nextStreak = state.streak + 1;
      const points = calculateScore(state.level, action.reactionMs, nextStreak);
      const nextLevel = state.level + 1;

      return {
        ...state,
        score: state.score + points,
        level: nextLevel,
        streak: nextStreak,
        bestStreak: Math.max(state.bestStreak, nextStreak),
        attempts: state.attempts + 1,
        hits: state.hits + 1,
        roundStartedAt: Date.now(),
        round: createRound(nextLevel)
      };
    }

    case 'wrong': {
      const nextLives = state.lives - 1;
      const isGameOver = nextLives <= 0;

      return {
        ...state,
        status: isGameOver ? 'gameOver' : 'playing',
        lives: nextLives,
        streak: 0,
        attempts: state.attempts + 1,
        roundStartedAt: Date.now(),
        round: isGameOver ? state.round : createRound(state.level)
      };
    }

    case 'restart':
      return createInitialState();

    default:
      return state;
  }
}

export default function PlayPage() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [feedback, setFeedback] = useState<{
    locked: boolean;
    correctIndex: number | null;
    wrongIndex: number | null;
    tone: 'error' | null;
    message: string | null;
  }>({
    locked: false,
    correctIndex: null,
    wrongIndex: null,
    tone: null,
    message: null
  });
  const [highScore, setHighScore] = useState(0);
  const [runHighBaseline, setRunHighBaseline] = useState(0);
  const [shareUrl, setShareUrl] = useState('https://gradientmind.github.io/gradient');
  const [gridBounds, setGridBounds] = useState({ width: 0, height: 0 });

  const timeoutRef = useRef<number | null>(null);
  const gridFrameRef = useRef<HTMLDivElement | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback({ locked: false, correctIndex: null, wrongIndex: null, tone: null, message: null });
  }, []);

  useEffect(() => {
    const storedScore = getHighScore();
    setHighScore(storedScore);
    setRunHighBaseline(storedScore);

    if (typeof window !== 'undefined') {
      const basePath = window.location.pathname.replace(/\/play\/?$/, '') || '/';
      setShareUrl(`${window.location.origin}${basePath}`);
    }
  }, []);

  useEffect(() => {
    if (state.status === 'gameOver' && state.score > highScore) {
      persistHighScore(state.score);
      setHighScore(state.score);
    }
  }, [state.status, state.score, highScore]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const frame = gridFrameRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }

      const nextWidth = Math.max(0, entry.contentRect.width);
      const nextHeight = Math.max(0, entry.contentRect.height);
      setGridBounds({ width: nextWidth, height: nextHeight });
    });

    observer.observe(frame);

    return () => {
      observer.disconnect();
    };
  }, []);

  const onSelect = (index: number) => {
    if (feedback.locked || state.status !== 'playing') {
      return;
    }

    const reactionMs = Date.now() - state.roundStartedAt;

    if (index === state.round.oddIndex) {
      setFeedback({
        locked: true,
        correctIndex: index,
        wrongIndex: null,
        tone: null,
        message: null
      });
      timeoutRef.current = window.setTimeout(() => {
        dispatch({ type: 'correct', reactionMs });
        clearFeedback();
      }, 250);
      return;
    }

    setFeedback({
      locked: true,
      correctIndex: state.round.oddIndex,
      wrongIndex: index,
      tone: 'error',
      message: 'Wrong pick. The highlighted tile was the correct one.'
    });
    timeoutRef.current = window.setTimeout(() => {
      dispatch({ type: 'wrong' });
      clearFeedback();
    }, 780);
  };

  const onRestart = () => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    clearFeedback();
    setRunHighBaseline(highScore);
    dispatch({ type: 'restart' });
  };

  const levelsReached = Math.max(1, state.level);
  const accuracy = state.attempts === 0 ? 0 : Math.round((state.hits / state.attempts) * 100);
  const isNewHigh = state.status === 'gameOver' && state.score > runHighBaseline;

  return (
    <main
      className="relative h-dvh overflow-hidden px-3 py-3 sm:px-6 sm:py-4"
      style={{
        backgroundColor: state.round.background,
        transition: 'background-color 450ms ease'
      }}
    >
      <GradientBg hue={state.round.hue} />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col gap-2 sm:gap-3">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/35 bg-white/10 px-3 py-1.5 text-xs font-medium tracking-[0.08em] text-white/90 transition hover:bg-white/20"
          >
            Back
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-white/65">Find the odd tile</p>
        </div>

        <ScoreBar score={state.score} level={state.level} lives={state.lives} maxLives={MAX_LIVES} />

        <AnimatePresence>
          {feedback.tone === 'error' && feedback.message ? (
            <motion.p
              key={feedback.message}
              className="self-center rounded-full border border-red-300/50 bg-red-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-100"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {feedback.message}
            </motion.p>
          ) : null}
          {state.streak >= 3 ? (
            <motion.p
              key={state.streak}
              className="self-center rounded-full border border-emerald-300/40 bg-emerald-400/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              Streak x{state.streak}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <section className="flex min-h-0 flex-1 rounded-3xl border border-white/20 bg-black/[0.18] p-2 shadow-2xl backdrop-blur-md sm:p-3">
          <div ref={gridFrameRef} className="flex min-h-0 w-full flex-1 items-center justify-center">
            <GameGrid
              size={state.round.size}
              colors={state.round.colors}
              disabled={feedback.locked || state.status !== 'playing'}
              correctIndex={feedback.correctIndex}
              wrongIndex={feedback.wrongIndex}
              onSelect={onSelect}
              roundKey={`${state.level}-${state.round.hue}`}
              availableWidth={gridBounds.width}
              availableHeight={gridBounds.height}
            />
          </div>
        </section>

        <p className="hidden text-center text-xs text-white/60 xl:block">
          Wrong picks cost one life. Faster picks and longer streaks earn bigger points.
        </p>
      </div>

      <AnimatePresence>
        {state.status === 'gameOver' ? (
          <GameOver
            score={state.score}
            levelsReached={levelsReached}
            bestStreak={state.bestStreak}
            accuracy={accuracy}
            highScore={highScore}
            isNewHigh={isNewHigh}
            swatchA={state.round.baseColor}
            swatchB={state.round.oddColor}
            shareUrl={shareUrl}
            onRestart={onRestart}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}
