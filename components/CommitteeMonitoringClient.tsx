'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  task_name: string
  status_tugas: string
}

interface Profile {
  id: string
  nama_lengkap: string
  no_whatsapp: string
  sub_tim: string
  panitia_tasks: Task[]
}

export default function CommitteeMonitoringClient({ profiles }: { profiles: Profile[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="animate-pulse text-4xl">🕌</div>
    </div>
  )

  const groupedProfiles = profiles.reduce((acc, profile) => {
    const team = profile.sub_tim || 'Lainnya'
    if (!acc[team]) acc[team] = []
    acc[team].push(profile)
    return acc
  }, {} as Record<string, Profile[]>)

  const subTeams = Object.keys(groupedProfiles).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <header className="mb-16 text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
          Struktur Organisasi
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-brand-primary tracking-tighter leading-none">
          Monitoring <span className="text-brand-accent italic">Panitia</span>
        </h1>
        <p className="text-zinc-500 font-medium max-w-xl mx-auto italic mt-4">
          "Barangsiapa yang memudahkan urusan saudaranya, maka Allah akan memudahkan urusannya di dunia dan akhirat." (HR. Muslim)
        </p>
      </header>

      <div className="space-y-20">
        {subTeams.map((team) => (
          <section key={team} className="relative">
            <div className="flex items-center gap-6 mb-10">
              <h2 className="text-3xl font-black uppercase tracking-widest text-brand-primary">{team}</h2>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-brand-primary/20 to-transparent"></div>
              <span className="text-[10px] font-black bg-brand-accent text-white px-4 py-1.5 rounded-xl uppercase shadow-lg shadow-amber-900/20">
                {groupedProfiles[team].length} PERSONEL
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedProfiles[team].map((p) => (
                <div key={p.id} className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 overflow-hidden group hover:border-brand-primary transition-all duration-500">
                  <div className="p-8">
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 bg-brand-primary/5 rounded-[1.5rem] flex items-center justify-center text-brand-primary text-2xl font-black shadow-inner group-hover:bg-brand-primary group-hover:text-white transition-all duration-500">
                        {p.nama_lengkap[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-brand-primary leading-tight uppercase">{p.nama_lengkap}</h3>
                        <p className="text-[10px] font-bold text-brand-accent uppercase tracking-widest mt-1 opacity-60">Pejuang Qurban</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-50 pb-2">
                         <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Amanah Tugas</h4>
                         <span className="text-[10px] font-bold text-zinc-300 italic">{p.panitia_tasks?.length || 0} Total</span>
                      </div>
                      
                      {p.panitia_tasks?.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic py-4 text-center">Menanti penugasan...</p>
                      ) : (
                        <div className="space-y-2.5">
                          {p.panitia_tasks.map((task) => (
                            <div key={task.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 group-hover:bg-brand-primary/5 transition-colors">
                              <p className="text-xs font-black text-zinc-700 leading-tight">{task.task_name}</p>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm uppercase ${task.status_tugas === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : task.status_tugas === 'Sedang Dikerjakan' ? 'bg-blue-100 text-blue-700' : 'bg-brand-accent/10 text-brand-accent'}`}>
                                {task.status_tugas}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-brand-primary w-full opacity-5 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {subTeams.length === 0 && (
        <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-zinc-100">
           <div className="text-5xl mb-6 opacity-20 text-brand-primary">☪️</div>
           <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Data khidmah panitia belum tersedia</p>
        </div>
      )}
    </div>
  )
}
