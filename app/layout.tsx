import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import config from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: config.site.title,
    template: `%s - ${config.site.title}`
  },
  description: config.site.description,
  keywords: ["app", "mobile", "application", "software", "macOS", "iOS", "Android"],
  authors: [{ name: "CodeEagle" }],
  creator: "SelfStudio",
  publisher: "SelfStudio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
