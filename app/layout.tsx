import type { Metadata } from "next";
import { IBM_Plex_Mono, Kanit, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import Topography from "@/components/effects/Topography";
import { siteConfig } from "@/data/site";

import "@/components/effects/DepthText.css";
import "@/components/effects/MaskedHeading.css";
import "@/components/effects/DecryptedText.css";
import "@/components/effects/Topography.css";
import "@/components/effects/WarpText.css";
import "@/components/ui/FuseButton.css";
import "./globals.css";

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
          <Topography
            bands={2.0}
            brightness={1.0}
            className="global-topography"
            colorMode="elevation"
            contrast={3.0}
            fillBands={false}
            glow={0.5}
            grain
            grainIntensity={0.05}
            highColor="#FFFFFF"
            lowColor="#5227FF"
            midColor="#FF9FFC"
            morphAmount={3.0}
            morphSpeed={0.05}
            mouseInteraction
            mouseRadius={0.3}
            mouseStrength={0.4}
            opacity={1.0}
            pixelSize={1.0}
            scale={1.0}
            speed={0.35}
            thickness={0.01}
          />
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
