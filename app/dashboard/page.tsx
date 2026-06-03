import { getPanitiaProfile } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { logout } from '../login/actions'

export default async function DashboardPage() {
  const panitia = await getPanitiaProfile()

  if (!panitia) {
    redirect('/login')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 bg-brand-primary p-10 rounded-[3rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center md:text-left">
          <p className="text-[10px] font-black uppercase text-emerald-200 tracking-[0.3em] mb-2">Ahlan wa Sahlan,</p>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">{panitia.nama_lengkap}</h1>
          <p className="text-emerald-100/60 font-black text-[10px] uppercase tracking-widest mt-2">{panitia.sub_tim} • {panitia.role}</p>
        </div>
        <form action={logout} className="relative z-10">
          <button className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black rounded-2xl border border-white/10 uppercase tracking-widest transition-all backdrop-blur-sm">
            LOGOUT
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 group hover:border-brand-primary transition-all duration-500 relative overflow-hidden">
          <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">🐄</div>
          <h2 className="font-black text-xl text-brand-primary uppercase tracking-tighter mb-2">Manajemen Lapangan</h2>
          <p className="text-xs font-medium text-zinc-400 leading-relaxed mb-8">Update data fisik hewan, unggah dokumentasi foto hidup & sembelih.</p>
          <a href="/dashboard/pic" className="inline-flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest group-hover:gap-4 transition-all">
            BUKA PANEL LAPANGAN <span className="text-lg">&rarr;</span>
          </a>
        </div>

        {(panitia.role === 'admin' || panitia.sub_tim === 'Bendahara') && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 group hover:border-brand-primary transition-all duration-500 relative overflow-hidden">
            <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">💰</div>
            <h2 className="font-black text-xl text-brand-primary uppercase tracking-tighter mb-2">Amanah Keuangan</h2>
            <p className="text-xs font-medium text-zinc-400 leading-relaxed mb-8">Kelola iuran pekurban, cicilan, dan catatan buku kas operasional masjid.</p>
            <a href="/dashboard/finance" className="inline-flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest group-hover:gap-4 transition-all">
              KELOLA KEUANGAN <span className="text-lg">&rarr;</span>
            </a>
          </div>
        )}

        {panitia.role === 'admin' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 group hover:border-brand-primary transition-all duration-500 relative overflow-hidden">
            <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">👥</div>
            <h2 className="font-black text-xl text-brand-primary uppercase tracking-tighter mb-2">Kontrol Personel</h2>
            <p className="text-xs font-medium text-zinc-400 leading-relaxed mb-8">Pantau daftar tugas panitia dan progres koordinasi seluruh sub-tim.</p>
            <a href="/dashboard/panitia" className="inline-flex items-center gap-2 text-[10px] font-black text-brand-accent uppercase tracking-widest group-hover:gap-4 transition-all">
              MONITORING PANITIA <span className="text-lg">&rarr;</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
