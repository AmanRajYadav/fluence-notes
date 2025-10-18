import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Fluence Notes",
  description: "A beautiful notes app with public and private note sharing - Powered by Fluence",
  applicationName: "Fluence Notes",
  authors: [{ name: "Fluence" }],
  generator: "Next.js",
  keywords: ["notes", "fluence", "note-taking", "productivity"],
  creator: "Fluence",
  publisher: "Fluence",
  metadataBase: new URL("https://fluence-notes.vercel.app"),
  openGraph: {
    title: "Fluence Notes",
    description: "A beautiful notes app with public and private note sharing",
    siteName: "Fluence Notes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
