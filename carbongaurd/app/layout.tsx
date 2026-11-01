import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbonGuard AI — Multi-Agent Carbon Compliance for Exporters",
  description: "AI-Powered CBAM and Embedded Emissions Compliance Platform for Indian MSME Exporters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fbfcf9] text-[#1c2b14] selection:bg-[#1c2b14] selection:text-white">
        {children}
      </body>
    </html>
  );
}
