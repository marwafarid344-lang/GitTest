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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5932974277970825"
          crossOrigin="anonymous"
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${outfit.variable} antialiased`}
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