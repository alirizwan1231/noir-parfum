import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOIRÉ — Parfum in Real 3D",
  description:
    "NOIRÉ luxury fragrance presented as a real-time 3D glass bottle. Buttery smooth scroll, drag to rotate, lift the cap, switch the scent — the liquid changes live.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ink text-cream font-body antialiased">{children}</body>
    </html>
  );
}
