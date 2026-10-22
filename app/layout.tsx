import type { Metadata, Viewport } from "next";
import { Great_Vibes, Nunito } from "next/font/google";
import EnregistrerSW from "@/components/EnregistrerSW";
import "./globals.css";

const calli = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-calli" });
const texte = Nunito({ subsets: ["latin"], variable: "--font-texte" });

export const metadata: Metadata = {
  title: "Vermeil · Créations uniques faites main au Bénin",
  description: "Découvre des créations uniques, faites main par de jeunes créateurs béninois.",
  icons: { icon: "/icone/192", apple: "/icone/180" },
  appleWebApp: { capable: true, title: "Vermeil", statusBarStyle: "default" },
};

export const viewport: Viewport = { themeColor: "#b3261e" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${calli.variable} ${texte.variable}`}>
      <body>
        {children}
        <EnregistrerSW />
      </body>
    </html>
  );
}
