import type { Metadata } from "next";
import { Manrope, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KFTCSBC | KFT Collegiate School Business Club",
    template: "%s | KFTCSBC",
  },
  description:
    "Explore entrepreneurship, business learning, and student collaboration at KFT Collegiate School Business Club (KFTCSBC).",
  openGraph: {
    title: "KFTCSBC | KFT Collegiate School Business Club",
    description:
      "Student-led entrepreneurship, communication, finance, and business leadership at KFT Collegiate School.",
    type: "website",
    locale: "en_BD",
    siteName: "KFT Collegiate School Business Club",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${notoBengali.variable}`}>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#d5ac50]/30 selection:text-[#14243b]">
        {children}
      </body>
    </html>
  );
}
