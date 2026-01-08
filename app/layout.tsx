import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Learn ABC - Fun Alphabet Learning",
  description: "A fun and interactive alphabet learning app for kids",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
  themeColor: "#ec4899",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Learn ABC",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

