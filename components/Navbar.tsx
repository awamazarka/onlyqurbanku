import Link from 'next/link'

export default function Navbar() {
  return (
    <>
    <nav className="bg-white border-b border-zinc-100 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <span className="text-lg">🌙</span>
          </div>
          <span className="text-xl font-black text-brand-primary tracking-tighter uppercase">
            Qurban<span className="text-brand-accent">kuy</span>
          </span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-xs font-black text-zinc-500 hover:text-brand-primary transition-colors tracking-widest uppercase">
            Monitoring Hewan
          </Link>
          <Link href="/monitoring-panitia" className="text-xs font-black text-zinc-500 hover:text-brand-primary transition-colors tracking-widest uppercase">
            Monitoring Panitia
          </Link>
          <Link href="/login" className="px-6 py-2.5 bg-brand-primary text-white text-[10px] font-black rounded-xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 uppercase tracking-[0.2em]">
            MASUK PANITIA
          </Link>
        </div>

        {/* Mobile Quick Action */}
        <div className="md:hidden flex items-center">
           <Link href="/login" className="w-10 h-10 bg-brand-primary/5 text-brand-primary rounded-xl flex items-center justify-center transition-all active:scale-95">
             <span className="text-xl">👤</span>
           </Link>
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Navigation - Ensuring 'Hewan' and 'Panitia' are always reachable */}
    <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-2 flex items-center justify-between overflow-hidden">
        <Link href="/" className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl hover:bg-brand-primary/5 transition-colors">
          <span className="text-xl">🐄</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Hewan</span>
        </Link>
        <Link href="/monitoring-panitia" className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl hover:bg-brand-primary/5 transition-colors">
          <span className="text-xl">👥</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Panitia</span>
        </Link>
        <Link href="/dashboard" className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl hover:bg-brand-primary/5 transition-colors">
          <span className="text-xl">🏗️</span>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Panel</span>
        </Link>
      </div>
    </div>
    </>
  )
}
