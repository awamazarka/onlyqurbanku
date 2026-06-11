'use client'

import Link from 'next/link'
import { useSidebar } from './DashboardShell'
import { usePathname } from 'next/navigation'

interface Panitia {
  nama_lengkap: string
}

export default function NavbarClient({ panitia }: { panitia: Panitia | null }) {
  const { setIsOpen } = useSidebar()
  const pathname = usePathname()
  const isDashboard = pathname.startsWith('/dashboard')
  
  const firstName = panitia ? panitia.nama_lengkap.split(' ')[0] : ''

  return (
    <>
    <nav className="bg-white border-b border-zinc-100 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {panitia && isDashboard && (
            <button 
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20 active:scale-95 transition-all md:hidden"
            >
              <span className="text-xl">☰</span>
            </button>
          )}
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <span className="text-lg">🌙</span>
            </div>
            <span className="text-xl font-black text-brand-primary tracking-tighter uppercase">
              Qurban<span className="text-brand-accent">kuy</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {panitia && isDashboard && (
            <button 
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-xs font-black text-brand-primary hover:text-emerald-800 transition-colors tracking-widest uppercase bg-brand-primary/5 px-4 py-2 rounded-xl"
            >
              <span className="text-lg">☰</span> MENU PANEL
            </button>
          )}
          
          <Link href="/" className="text-xs font-black text-zinc-500 hover:text-brand-primary transition-colors tracking-widest uppercase">
            Monitoring Hewan
          </Link>
          <Link href="/struktur-panitia" className="text-xs font-black text-zinc-500 hover:text-brand-primary transition-colors tracking-widest uppercase">
            Struktur
          </Link>
          <Link href="/events" className="text-xs font-black text-zinc-500 hover:text-brand-primary transition-colors tracking-widest uppercase">
            Kegiatan
          </Link>
          {panitia ? (
            <Link href="/dashboard" className="px-6 py-2.5 bg-brand-primary text-white text-[10px] font-black rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 uppercase tracking-[0.2em]">
              PANEL DASHBOARD
            </Link>
          ) : (
            <Link href="/login" className="px-6 py-2.5 bg-brand-primary text-white text-[10px] font-black rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 uppercase tracking-[0.2em]">
              MASUK PANITIA
            </Link>
          )}
        </div>

        {/* Mobile Quick Action */}
        <div className="md:hidden flex items-center">
           <Link href={panitia ? "/dashboard" : "/login"} className="w-10 h-10 bg-brand-primary/5 text-brand-primary rounded-xl flex items-center justify-center transition-all active:scale-95">
             <span className="text-xl">{panitia ? "🏗️" : "👤"}</span>
           </Link>
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Navigation */}
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50 pointer-events-none">
      <div className="flex items-center justify-between pointer-events-auto px-2 py-2">
        <Link href="/" className="flex flex-col items-center gap-1 transition-transform active:scale-90">
          <div className="w-9 h-9 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-lg">🐄</span>
          </div>
          <span className="text-[6px] font-black uppercase tracking-[0.2em] text-brand-primary drop-shadow-sm">Hewan</span>
        </Link>
        <Link href="/struktur-panitia" className="flex flex-col items-center gap-1 transition-transform active:scale-90">
          <div className="w-9 h-9 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-lg">🌳</span>
          </div>
          <span className="text-[6px] font-black uppercase tracking-[0.2em] text-brand-primary drop-shadow-sm">Struktur</span>
        </Link>
        <Link href="/events" className="flex flex-col items-center gap-1 transition-transform active:scale-90">
          <div className="w-9 h-9 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-lg">📅</span>
          </div>
          <span className="text-[6px] font-black uppercase tracking-[0.2em] text-brand-primary drop-shadow-sm">Event</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center gap-1 transition-transform active:scale-90">
          <div className="w-9 h-9 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center shadow-lg border border-white/20">
            <span className="text-lg">🏗️</span>
          </div>
          <span className="text-[6px] font-black uppercase tracking-[0.2em] text-brand-primary drop-shadow-sm">Panel</span>
        </Link>
      </div>
    </div>
    </>
  )
}
