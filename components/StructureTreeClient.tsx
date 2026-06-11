'use client'

import { useMemo } from 'react'

interface Profile {
  nama_lengkap: string
  sub_tim: string
  role: string
  id?: string
}

export default function StructureTreeClient({ profiles }: { profiles: Profile[] }) {
  // Ambil Ketua berdasarkan sub_tim: 'Ketua'
  const ketua = useMemo(() => profiles.find(p => p.sub_tim === 'Ketua'), [profiles])
  
  // Ambil semua sub_tim unik selain dari 'Ketua'
  const teams = useMemo(() => Array.from(new Set(profiles
    .filter(p => p.sub_tim !== 'Ketua')
    .map(p => p.sub_tim)))
    .filter(Boolean)
    .sort(), [profiles])

  const getTeamColor = (teamName: string) => {
    const colors: Record<string, string> = {
      'Bendahara': 'bg-amber-500',
      'Logistik': 'bg-blue-500',
      'Logistik & Hewan': 'bg-blue-500',
      'Jagal': 'bg-rose-500',
      'Jagal & Kuliti': 'bg-rose-500',
      'Distribusi': 'bg-emerald-500',
    }
    return colors[teamName] || 'bg-zinc-500'
  }

  const TeamBox = ({ title, members, colorClass }: { title: string, members: Profile[], colorClass: string }) => (
    <div className="flex flex-col items-center w-full min-w-[140px] md:min-w-[180px]">
      <div className={`w-full px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl ${colorClass} text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg mb-3 md:mb-4 text-center transform hover:scale-105 transition-transform duration-300`}>
        {title}
      </div>
      <div className="flex flex-col gap-1.5 md:gap-2 w-full px-2">
        {members.length > 0 ? members.map((m, i) => (
          <div key={i} className="px-3 md:px-4 py-1.5 md:py-2 bg-white border border-zinc-100 rounded-lg md:rounded-xl shadow-sm text-center hover:border-brand-primary transition-colors">
            <p className="text-[10px] md:text-[11px] font-black text-brand-primary uppercase truncate">{m.nama_lengkap}</p>
          </div>
        )) : (
          <p className="text-[8px] font-bold text-zinc-300 italic uppercase text-center">Kosong</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-full overflow-hidden flex flex-col">
      <header className="text-center py-12 md:py-20 px-4 shrink-0">
        <div className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-[0.2em] mb-4">
          Struktur Organisasi
        </div>
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-brand-primary tracking-tighter uppercase leading-none">
          Kepanitiaan <span className="text-brand-accent italic">Qurban</span>
        </h1>
        <p className="text-zinc-500 font-medium max-w-xl mx-auto italic mt-4 text-xs md:text-sm px-4 opacity-70">
          "Saling tolong menolonglah kamu dalam mengerjakan kebajikan dan takwa."
        </p>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-20 scrollbar-hide">
        <div className="inline-flex flex-col items-center min-w-full px-8 md:px-20 gap-16 relative">
          {/* Top Level: Ketua */}
          <div className="relative pt-4">
            <div className="px-8 md:px-12 py-4 md:py-6 bg-brand-primary rounded-[2rem] text-white shadow-2xl shadow-emerald-900/40 text-center relative z-10 border-4 border-white">
              <p className="text-[8px] md:text-[9px] font-black text-emerald-200 uppercase tracking-widest mb-1 opacity-80">Ketua Panitia</p>
              <h2 className="text-lg md:text-2xl font-black uppercase tracking-tight">{ketua?.nama_lengkap || 'Belum Ditentukan'}</h2>
            </div>
            {/* Vertical line down */}
            {teams.length > 0 && (
              <div className="absolute left-1/2 -bottom-16 w-[2px] h-16 bg-gradient-to-b from-brand-primary to-zinc-200 -translate-x-1/2 hidden md:block"></div>
            )}
            {/* Mobile Vertical line */}
            {teams.length > 0 && (
              <div className="absolute left-1/2 -bottom-16 w-[2px] h-16 bg-brand-primary -translate-x-1/2 md:hidden"></div>
            )}
          </div>

          {/* Level 2: Sub-Teams Dynamic Grid */}
          {teams.length > 0 && (
            <div className="relative pt-10">
              {/* Horizontal line (Desktop) */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-zinc-200 hidden md:block"></div>
              {/* Horizontal line (Mobile - shorter) */}
              <div className="absolute top-0 left-[20px] right-[20px] h-[2px] bg-zinc-200 md:hidden"></div>
              
              <div className="flex gap-6 md:gap-12 relative px-4">
                {teams.map((team, index) => {
                  const members = profiles.filter(p => p.sub_tim === team)
                  
                  return (
                    <div key={team} className="relative flex flex-col items-center shrink-0">
                      {/* Connection line up to horizontal line */}
                      <div className="absolute -top-10 left-1/2 w-[2px] h-10 bg-zinc-200 -translate-x-1/2"></div>
                      <TeamBox 
                        title={team} 
                        members={members} 
                        colorClass={getTeamColor(team)} 
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        {/* Hint for mobile users */}
        <div className="md:hidden text-center mt-12 animate-bounce">
          <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">Geser untuk melihat anggota &rarr;</p>
        </div>
      </div>
    </div>
  )
}
