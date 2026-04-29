import type { Metadata } from "next";
import { Lexend, Source_Sans_3 } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Preloader } from "@/components/ui/Preloader";
import { AuthProvider } from "@/lib/auth/AuthContext";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VISHWAS — Your Voice. Your Right. Your Justice.",
  description:
    "A trust-mediated grievance platform empowering communities to report issues safely, track progress transparently, and verify real action by authorities.",
  keywords: [
    "grievance",
    "complaint",
    "civic tech",
    "trust",
    "voice",
    "accountability",
  ],
};

import { I18nProvider } from "@/lib/i18n/I18nContext";
import { AIChatWidget } from "@/components/ui/AIChatWidget";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${lexend.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="min-h-screen bg-bg-primary text-text-primary font-sans antialiased flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nProvider>
            <AuthProvider>
              <Preloader />
              <ScrollProgress />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <AIChatWidget />
            </AuthProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
