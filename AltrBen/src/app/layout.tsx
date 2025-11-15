// app/layout.tsx

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multiverse Student Simulator",
  description:
    "Explore parallel universes of your academic timeline with AI-powered insights",
  icons: {
    icon: "/favicon.png", // Relative path from the public directory
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>
        <div className="relative min-h-screen w-full bg-gray-900">
          <main className="flex-grow">{children}</main>
        </div>
      </body>
    </html>
  );
}
