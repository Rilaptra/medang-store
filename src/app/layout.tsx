"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "next-theme";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "School E-commerce",
  description: "A marketplace for the school community",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
            <Toaster richColors={true} />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
