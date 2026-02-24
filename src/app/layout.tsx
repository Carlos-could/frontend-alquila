import type { Metadata } from "next";
import { Space_Grotesk, Source_Sans_3 } from "next/font/google";
import { GlobalErrorListeners } from "@/components/global-error-listeners";
import { env } from "@/config/env";
import "./globals.css";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alquila | Rentals",
  description: "Rental listing and map experience",
};

void env;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${heading.variable} ${body.variable}`}>
        <GlobalErrorListeners />
        {children}
      </body>
    </html>
  );
}
