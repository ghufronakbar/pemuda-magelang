import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../providers/auth-provider";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import { getAppData } from "@/actions/app-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const generateMetadata = async (): Promise<Metadata> => {
  const appData = await getAppData();
  return {
    title: {
      default: "Pemuda Magelang",
      template: "%s | Pemuda Magelang",
    },
    description:
      "Platform kolaborasi untuk karya, komunitas, dan kegiatan kebudayaan.",
    icons: {
      icon: appData.baseLogo || "/favicon.ico",
    },
  };
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const session = await auth();

  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider session={session}>{children}</AuthProvider>
        <Toaster
          position="top-right"
          duration={2000}
          theme="light"
          richColors
        />
      </body>
    </html>
  );
}
