import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ITZFIZZ // Scroll-Driven Kinetic Runway — McLaren 720S',
  description: 'A bespoke, scroll-driven interactive hero section animation. Kinetic scrub interpolation, spatial letter lighting, and real-time procedural audio synthesis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#08090C] text-slate-100 antialiased overflow-x-clip selection:bg-[#D6F830] selection:text-black arch-grid">
        {children}
      </body>
    </html>
  );
}
