import { getPanitiaProfile } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../login/actions'

export default async function DashboardPage() {
  const panitia = await getPanitiaProfile()

  if (!panitia) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-16">
        <p className="text-[10px] font-black uppercase text-brand-primary tracking-[0.3em] mb-2">Ahlan wa Sahlan,</p>
        <h1 className="text-5xl font-black tracking-tighter uppercase text-brand-primary leading-none">{panitia.nama_lengkap}</h1>
        <p className="text-zinc-400 font-black text-[10px] uppercase tracking-widest mt-3">Silakan klik ikon menu (☰) di pojok kiri atas untuk mulai berkhidmah.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Quick Stats Placeholder */}
        <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Status Akun</p>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-black text-brand-primary uppercase tracking-tight">Aktif Berkhidmah</p>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Aksesibilitas</p>
          <p className="text-sm font-black text-brand-primary uppercase tracking-tight">{panitia.role}</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Sub Tim</p>
          <p className="text-sm font-black text-brand-primary uppercase tracking-tight">{panitia.sub_tim}</p>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-zinc-100 shadow-sm">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">Sesi Aktif</p>
          <p className="text-sm font-black text-brand-primary uppercase tracking-tight">30 Menit</p>
        </div>
      </div>
    </div>
  )
}
