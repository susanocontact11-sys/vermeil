import type { Metadata } from "next";
import { Great_Vibes, Nunito } from "next/font/google";
import "./globals.css";

const calli = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-calli" });
const texte = Nunito({ subsets: ["latin"], variable: "--font-texte" });

export const metadata: Metadata = {
  title: "Vybénia  · Créations uniques faites main au Bénin",
  description: "Découvre des créations uniques, faites main par de jeunes créateurs béninois.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${calli.variable} ${texte.variable}`}>
      <body>{children}</body>
    </html>
  );
}
