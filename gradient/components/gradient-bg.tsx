'use client';

import { motion } from 'framer-motion';

type GradientBgProps = {
  hue?: number;
};

export function GradientBg({ hue = 198 }: GradientBgProps) {
  const secondHue = (hue + 64) % 360;
  const thirdHue = (hue + 170) % 360;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -left-1/3 -top-1/4 h-[70vh] w-[70vh] rounded-full opacity-70 blur-3xl"
        style={{
          background: `radial-gradient(circle, hsl(${hue} 92% 58% / 0.7), transparent 70%)`
        }}
        animate={{
          x: ['0%', '10%', '-6%', '0%'],
          y: ['0%', '8%', '-10%', '0%']
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/3 -right-1/4 h-[68vh] w-[68vh] rounded-full opacity-70 blur-3xl"
        style={{
          background: `radial-gradient(circle, hsl(${secondHue} 94% 54% / 0.6), transparent 72%)`
        }}
        animate={{
          x: ['0%', '-9%', '7%', '0%'],
          y: ['0%', '-9%', '6%', '0%']
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[32%] top-[46%] h-[46vh] w-[46vh] rounded-full opacity-55 blur-3xl"
        style={{
          background: `radial-gradient(circle, hsl(${thirdHue} 96% 61% / 0.5), transparent 70%)`
        }}
        animate={{
          scale: [1, 1.12, 0.94, 1],
          rotate: [0, -8, 6, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.25),rgba(0,0,0,0.5))]" />
    </div>
  );
}
