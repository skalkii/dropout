import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Source_Serif_4 } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";
import { ThemeProvider, THEME_INIT_SCRIPT } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { SkipLink } from "./components/SkipLink";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#262624" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SkipLink />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
