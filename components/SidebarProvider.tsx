'use client'

import { useState, useEffect, createContext, useContext, useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/login/actions'

interface Panitia {
  nama_lengkap: string
  sub_tim: string
  role: string
}

const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) return { isOpen: false, setIsOpen: () => {} };
  return context;
}

const MENU_ITEMS = [
  { name: 'Ringkasan', href: '/dashboard', icon: '🏠', roles: ['admin', 'panitia'] },
  { name: 'Lapangan', href: '/dashboard/pic', icon: '🐄', roles: ['admin', 'panitia'] },
  { name: 'Keuangan', href: '/dashboard/finance', icon: '💰', roles: ['admin', 'Bendahara'] },
  { name: 'Manajemen Tugas', href: '/dashboard/panitia', icon: '📝', roles: ['admin'] },
  { name: 'Monitoring Tim', href: '/dashboard/monitoring', icon: '👥', roles: ['admin', 'panitia'] },
  { name: 'Event Mushala', href: '/dashboard/events', icon: '📅', roles: ['admin'] },
]

export default function SidebarProvider({ 
  panitia, 
  children 
}: { 
  panitia: Panitia | null, 
  children: React.ReactNode 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const filteredMenu = useMemo(() => {
    if (!panitia) return []
    return MENU_ITEMS.filter(item => 
      panitia.role === 'admin' || 
      item.roles.includes(panitia.role) || 
      item.roles.includes(panitia.sub_tim)
    )
  }, [panitia])

  if (!panitia) return <>{children}</>

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}

      {/* Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] bg-brand-primary/20 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 bottom-0 z-[70] w-80 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto scrollbar-hide`}>
        <div className="min-h-full flex flex-col p-8">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white text-sm">🌙</div>
              <span className="font-black text-brand-primary tracking-tighter uppercase">Qurban<span className="text-brand-accent">kuy</span></span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-300 hover:text-zinc-900 text-2xl font-light">×</button>
          </div>

          <div className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-6 px-2">Menu Khidmah</p>
            {filteredMenu.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group ${pathname === item.href ? 'bg-brand-primary text-white shadow-lg shadow-emerald-900/20' : 'hover:bg-zinc-50 text-zinc-500 hover:text-brand-primary'}`}
              >
                <span className={`text-xl transition-transform group-hover:scale-110 ${pathname === item.href ? 'opacity-100' : 'opacity-50'}`}>{item.icon}</span>
                <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-zinc-100">
            <div className="flex items-center gap-4 mb-8 px-2">
              <div className="w-12 h-12 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-xl text-brand-primary font-black uppercase">
                {panitia.nama_lengkap[0]}
              </div>
              <div>
                <p className="text-[11px] font-black text-brand-primary uppercase leading-tight">{panitia.nama_lengkap}</p>
                <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{panitia.sub_tim} • {panitia.role}</p>
              </div>
            </div>
            <form action={logout}>
              <button className="w-full py-4 bg-zinc-900 text-white text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors shadow-lg active:scale-95">
                LOGOUT SESSION
              </button>
            </form>
          </div>
        </div>
      </aside>
    </SidebarContext.Provider>
  )
}
