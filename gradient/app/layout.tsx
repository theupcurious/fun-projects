import type { Metadata } from 'next';
import { DM_Sans, Space_Mono } from 'next/font/google';
import './globals.css';

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body'
});

const displayFont = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gradientmind.github.io'),
  title: 'Gradient — Color Perception Game',
  description: 'Find the odd tile out before your lives run out.',
  openGraph: {
    title: 'Gradient — Color Perception Game',
    description: 'Find the odd tile out before your lives run out.',
    images: ['/og-image.png']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gradient — Color Perception Game',
    description: 'Find the odd tile out before your lives run out.',
    images: ['/og-image.png']
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} font-sans`}>{children}</body>
    </html>
  );
}
