const HIGH_SCORE_KEY = 'gradient:high-score';

export const getHighScore = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
  if (!raw) {
    return 0;
  }

  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const setHighScore = (score: number): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(HIGH_SCORE_KEY, String(Math.max(score, 0)));
};
