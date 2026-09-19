import type { Metadata } from "next";
import { Fraunces, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { auth } from "@/auth";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PawnX",
  description:
    "Grandmaster-grade opening trainer — repertoire trees, spaced repetition, and master-book reference.",
  icons: { icon: "/pawn_1.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // ← v5: auth() ფუნქცია, არა getServerSession
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}