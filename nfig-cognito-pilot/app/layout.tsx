import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFIG Cognito Pilot App",
  description: "NOAA National Federated Identity Gateway - AWS Cognito Proof of Concept",
  keywords: ["NOAA", "Cognito", "OIDC", "Authentication", "Federation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Navigation component will be added here */}
        {children}
      </body>
    </html>
  );
}
