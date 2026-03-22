import type { Metadata } from "next";
import { Inter, Roboto_Mono, Rubik, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { NotificationProvider } from "@/hooks/use-notifications";
import DevToolsProtection from "@/components/DevToolsProtection";

// Inter as Geist Sans replacement
const geistSans = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

// Roboto Mono as Geist Mono replacement
const geistMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Rubik font
const rubik = Rubik({
  subsets: ["latin", "arabic"],
  variable: "--font-rubik",
});

// Outfit for headers
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Chameleon | Future Skills",
  description:
    "Master your future skills with Chameleon, the ultimate platform for learning and growth With a focus on technology, design, and innovation.",
  icons: {
    icon: [{ url: "/images/1212-removebg-preview.png", sizes: "any" }],
    apple: "/images/1212-removebg-preview.png",
  },
  other: {
    "google-adsense-account": "ca-pub-5932974277970825",
  },
};

// Ads toggle: Set to false to disable all ads across the site
export const ENABLE_ADS = false;

// Cache toggle: Set to true to force a refresh for all users by disabling browser caching
// This is very useful when pushing updates and students' mobile devices are stuck on old versions.
export const DISABLE_CACHE = true;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {DISABLE_CACHE && (
          <>
            <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            <meta httpEquiv="Pragma" content="no-cache" />
            <meta httpEquiv="Expires" content="0" />
          </>
        )}
        {ENABLE_ADS && (
          <Script
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5932974277970825"
            crossOrigin="anonymous"
          />
        )}
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${outfit.variable} antialiased ${
          !ENABLE_ADS ? "hide-all-ads" : ""
        }`}
      >
        <NotificationProvider>
          <ToastProvider>
            <DevToolsProtection />
            {children}
          </ToastProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
