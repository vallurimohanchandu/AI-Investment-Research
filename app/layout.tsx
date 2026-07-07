import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

/**
 * Root layout for the AI Investment Research Agent.
 *
 * Wraps every page with fonts, global styles, and HTML shell.
 * Font CSS variables are consumed by tailwind.config.ts (font-sans, font-mono).
 */

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI Investment Research Agent",
  description:
    "AI-powered investment research using web search and Gemini analysis. " +
    "Get structured reports with scores, SWOT analysis, and recommendations.",
  keywords: [
    "investment research",
    "AI analysis",
    "stock research",
    "company analysis",
    "Gemini",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
