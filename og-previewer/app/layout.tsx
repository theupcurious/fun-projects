import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OG Previewer — Social Card Preview Tool",
  description:
    "Paste any public URL and see an approximate preview of how it will appear when shared on X, WhatsApp, and Slack.",
  openGraph: {
    title: "OG Previewer — Social Card Preview Tool",
    description:
      "Instantly preview how any URL will look when shared on X, WhatsApp, and Slack.",
    url: "https://og.upcurious.co",
    siteName: "OG Previewer by Upcurious",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OG Previewer — Social Card Preview Tool",
    description:
      "Instantly preview how any URL will look when shared on X, WhatsApp, and Slack.",
    site: "@upcurious",
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
      className={`${plusJakarta.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-[var(--font-body)]">
        {children}
      </body>
    </html>
  );
}
