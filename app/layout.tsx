import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_TITLE = "Dropout — Watch a neural network overfit, then watch it dream.";
const SITE_DESC =
  "An interactive essay on Erik Hoel's Overfitted Brain Hypothesis. Train a network, watch it overfit, and watch dreams put it right.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://dropout.local",
  ),
  title: SITE_TITLE,
  description: SITE_DESC,
  authors: [{ name: "skalkii" }],
  keywords: [
    "Overfitted Brain Hypothesis",
    "Erik Hoel",
    "dreams",
    "machine learning",
    "regularization",
    "dropout",
    "TensorFlow.js",
    "interactive essay",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    type: "article",
    siteName: "Dropout",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0c1a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
