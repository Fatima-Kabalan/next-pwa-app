import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Remove themeColor and viewport from metadata
export const metadata: Metadata = {
  title: "PWA NextJS",
  description: "It's a simple progressive web application made with NextJS",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["nextjs", "next14", "pwa", "next-pwa"],
  authors: [
    {
      name: "fatima",
      url: "https://www.linkedin.com/in/fatima-kabalan/",
    },
  ],
  icons: [{ rel: "apple-touch-icon", url: "icons/apple-touch-icon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta
          name="theme-color"
          content="#fff"
          media="(prefers-color-scheme: dark)"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
