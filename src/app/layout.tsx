import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProviders from "@/components/ClientProviders";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Jonathan's Prediction Market",
  description: "Create, trade, and resolve prediction markets. Built by Jonathan Sher.",
  openGraph: {
    title: "Jonathan's Prediction Market",
    description: "Create, trade, and resolve prediction markets. Built by Jonathan Sher.",
    url: "/",
    siteName: "Jonathan's Prediction Market",
    images: [
      {
        url: "/prediction-market.png",
        width: 800,
        height: 300,
        alt: "Jonathan's Prediction Market banner",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jonathan's Prediction Market",
    description: "Create, trade, and resolve prediction markets. Built by Jonathan Sher.",
    images: ["/prediction-market.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
