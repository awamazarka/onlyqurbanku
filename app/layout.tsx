import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SidebarProvider from "@/components/SidebarProvider";
import { getPanitiaProfile } from "@/utils/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Qurbankuy - Khidmah Ibadah Qurban",
  description: "Sistem monitoring dan manajemen qurban masjid digital bertema Idul Adha",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const panitia = await getPanitiaProfile();

  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fdfdfb] text-zinc-900 selection:bg-brand-primary/10 selection:text-brand-primary">
        <SidebarProvider panitia={panitia}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="py-16 pb-32 md:pb-16 text-center border-t border-zinc-100 bg-white">
            <div className="max-w-7xl mx-auto px-4">
              <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🌙</span>
              </div>
              <p className="text-[10px] font-black uppercase text-brand-primary tracking-[0.2em]">Qurbankuy Digital</p>
              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
                &copy; {new Date().getFullYear()} • AWP • Khidmah untuk Ummah
              </p>
            </div>
          </footer>
        </SidebarProvider>
      </body>
    </html>
  );
}
