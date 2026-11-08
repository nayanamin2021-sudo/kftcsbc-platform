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
  metadataBase: new URL("https://kftcsbc-platform.vercel.app"),
  title: {
    default: "KFTCSBC | KFT Collegiate School Business Club",
    template: "%s | KFTCSBC",
  },
  description:
    "Empowering Future Entrepreneurs — Workshop, Leadership, and Networking at KFT Collegiate School Business Club (KFTCSBC, Estd. 2026).",
  openGraph: {
    title: "KFTCSBC | KFT Collegiate School Business Club",
    description:
      "Empowering Future Entrepreneurs across Boys' Wing & Girls' Wing at KFT Collegiate School Business Club (Estd. 2026).",
    type: "website",
    locale: "en_BD",
    siteName: "KFT Collegiate School Business Club",
    images: ["/images/kftcsbc/club-logo.png"],
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
