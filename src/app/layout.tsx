import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ChatWidget from "../components/ChatWidget";
import MouseLightProvider from "../components/MouseLightProvider";
import { VapiProvider } from "../components/VapiContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-stitch",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verbaflow LLC - Grow Your Business with AI",
  description: "Modern websites, marketing, and AI Solutions for local businesses. Streamline operations, boost leads, and automate your workflow with expert support in Montgomery County.",
  keywords: "web development, AI Automation, digital marketing, Montgomery County, business growth",
  authors: [{ name: "Verbaflow LLC" }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <VapiProvider>
          <MouseLightProvider />
          {children}
          <ChatWidget />
        </VapiProvider>
      </body>
    </html>
  );
}
