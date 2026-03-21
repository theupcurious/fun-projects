import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vibe — Design Language Generator",
  description:
    "Stop building with AI defaults. Define your palette, typography, and component style — then export a prompt that makes your tools follow your vision.",
  openGraph: {
    title: "Vibe — Design Language Generator",
    description: "Stop building with AI defaults. Define your design language and export a prompt for Cursor, Claude, or ChatGPT.",
    siteName: "Vibe by Upcurious",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-[#0d0d0d] font-[family-name:var(--font-space-grotesk)]"
        style={{ colorScheme: "dark" }}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
