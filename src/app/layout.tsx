"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/header";
import AuthProvider from "@/components/auth-provider";
import { ThemeProvider } from "next-theme";
import { Toaster } from "sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Medang",
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
              <Suspense
                fallback={
                  <div className="flex justify-center items-center h-full">
                    <span className="animate-pulse text-2xl font-semibold">
                      Loading...
                    </span>
                  </div>
                }
              >
                <main className="flex-grow">{children}</main>
              </Suspense>
            </div>
            <Toaster richColors={true} />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
