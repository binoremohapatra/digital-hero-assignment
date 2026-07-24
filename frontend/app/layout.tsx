import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DotField from "@/components/DotField";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LeadDesk Mini",
  description: "Capture and manage your leads effectively.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 min-h-screen antialiased flex flex-col relative`}>
        <div className="fixed inset-0 z-0">
          {/* @ts-ignore */}
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#A855F7"
            gradientTo="#B497CF"
            glowColor="#120F17"
          />
        </div>
        <main className="flex-grow flex flex-col relative z-10">{children}</main>
      </body>
    </html>
  );
}
