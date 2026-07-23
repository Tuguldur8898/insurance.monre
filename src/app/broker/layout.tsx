import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Брокерын систем — ins.monre",
  description: "ins.monre даатгалын брокерын систем",
};

export default function BrokerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0b1120]">{children}</body>
    </html>
  );
}
