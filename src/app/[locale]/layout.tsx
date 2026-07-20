import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import ApolloClientProvider from "@/lib/apollo/provider";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  title: "Monre Insurance — Дижитал даатгалын платформ",
  description:
    "Monre Insurance нь таны дижитал ирээдүйг хамгаалах найдвартай, орчин үеийн даатгалын платформ юм.",
};

export function generateStaticParams() {
  return [{ locale: "mn" }];
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NextIntlClientProvider messages={messages}>
          <ApolloClientProvider>
            <Providers>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </Providers>
          </ApolloClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
