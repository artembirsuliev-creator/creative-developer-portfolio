import type { Metadata } from "next";
import { IBM_Plex_Mono, Kanit, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { siteConfig } from "@/data/site";

import "@/components/effects/DepthText.css";
import "@/components/effects/MaskedHeading.css";
import "@/components/effects/DecryptedText.css";
import "@/components/effects/Topography.css";
import "@/components/effects/WarpText.css";
import "@/components/ui/FuseButton.css";
import "./globals.css";
import "./signal.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.role}`,
  description: siteConfig.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} ${kanit.variable}`}>
        <div className="template-site">
          <div className="template-site-content">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </div>
      </body>
    </html>
  );
}
