'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Pekurban {
  id: string
  nama_pekurban: string
  asal_rt_rw: string
  slot_number: number
  payment_status: string
}

interface Animal {
  id: string
  tag_number: string
  jenis_hewan: string
  tipe_jenis: string
  status_hewan: string
  photo_url: string | null
  pekurban_names: Pekurban[]
}

export default function MonitoringClient({ animals }: { animals: Animal[] }) {
  const [activeTab, setActiveTab] = useState<'Sapi' | 'Kambing'>('Sapi')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center">
       <div className="animate-bounce text-4xl">🌙</div>
    </div>
  )

  const filteredAnimals = animals.filter(a => a.jenis_hewan === activeTab)
  
  const totalAnimals = animals.length
  const finishedAnimals = animals.filter(a => a.status_hewan === 'Selesai Sembelih').length
  const progressPercent = totalAnimals > 0 ? Math.round((finishedAnimals / totalAnimals) * 100) : 0
  
  const totalPekurban = animals.reduce((acc, animal) => acc + (animal.pekurban_names ? animal.pekurban_names.length : 0), 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai Sembelih': return 'bg-emerald-100 text-emerald-700'
      case 'Siap Sembelih': return 'bg-amber-100 text-amber-700'
      case 'Di Kandang': return 'bg-blue-100 text-blue-700'
      default: return 'bg-zinc-100 text-zinc-500'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <header className="mb-16 text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
          Laporan Real-time Idul Adha
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-brand-primary tracking-tighter leading-none">
          Monitoring <span className="text-brand-accent italic">Qurban</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-black text-brand-primary/60 uppercase tracking-[0.15em] leading-none">
          Mushala Raudhatul Muttaqin
        </h2>
        <p className="text-zinc-500 font-medium max-w-xl mx-auto italic">
          "Daging-daging qurban dan darahnya itu sekali-kali tidak dapat mencapai (keridhaan) Allah, tetapi ketakwaan darimulah yang dapat mencapainya.
          <span className="font-bold"> (QS. Al-Hajj: 37)</span>"
        </p>
      </header>

      {/* Stats Summary - Islamic Themed */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 text-5xl md:text-6xl">🐄</div>
          <p className="text-[9px] md:text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Sapi</p>
          <p className="text-4xl md:text-5xl font-black text-brand-primary">{animals.filter(a => a.jenis_hewan === 'Sapi').length}</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 text-5xl md:text-6xl">🐐</div>
          <p className="text-[9px] md:text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Kambing</p>
          <p className="text-4xl md:text-5xl font-black text-brand-primary">{animals.filter(a => a.jenis_hewan === 'Kambing').length}</p>
        </div>
        <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 text-5xl md:text-6xl">👥</div>
          <p className="text-[9px] md:text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1">Shohibul Qurban</p>
          <p className="text-4xl md:text-5xl font-black text-brand-primary">{totalPekurban}</p>
        </div>
        <div className="bg-brand-primary p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform duration-500 text-white italic font-black text-[100px] md:text-[120px] leading-none pointer-events-none">%</div>
          <p className="text-[9px] md:text-[10px] font-black uppercase text-emerald-200 tracking-widest mb-1">Progres</p>
          <p className="text-4xl md:text-5xl font-black text-white">{progressPercent}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1.5 bg-white border border-zinc-100 rounded-3xl shadow-lg shadow-emerald-900/5">
          <button 
            onClick={() => setActiveTab('Sapi')}
            className={`px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Sapi' ? 'bg-brand-primary text-white shadow-lg shadow-emerald-900/20' : 'text-zinc-400 hover:text-brand-primary'}`}
          >
            Sapi
          </button>
          <button 
            onClick={() => setActiveTab('Kambing')}
            className={`px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'Kambing' ? 'bg-brand-primary text-white shadow-lg shadow-emerald-900/20' : 'text-zinc-400 hover:text-brand-primary'}`}
          >
            Kambing
          </button>
        </div>
      </div>

      {filteredAnimals.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-zinc-100 italic">
          <div className="text-4xl mb-4 opacity-20">📭</div>
          <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Belum ada data {activeTab}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredAnimals.map((animal) => (
            <div key={animal.id} className="group bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 overflow-hidden hover:translate-y-[-8px] transition-all duration-500 flex flex-col">
              <div className="p-8 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">{animal.tipe_jenis || animal.jenis_hewan}</span>
                    </div>
                    <h2 className="text-4xl font-black text-brand-primary tracking-tighter leading-none uppercase">{animal.tag_number}</h2>
                  </div>
                  <span className={`px-4 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-tighter shadow-sm border border-zinc-50 ${getStatusColor(animal.status_hewan)}`}>
                    {animal.status_hewan}
                  </span>
                </div>

                <div className="space-y-2.5 mt-8">
                  {activeTab === 'Sapi' ? (
                    Array.from({ length: 7 }).map((_, i) => {
                      const slotNum = i + 1
                      const pekurban = animal.pekurban_names.find(p => p.slot_number === slotNum)
                      
                      return (
                        <div key={slotNum} className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${pekurban ? 'bg-zinc-50 border-zinc-100 dark:bg-zinc-950/50' : 'bg-white border-dashed border-zinc-200 opacity-60'}`}>
                          <div className="flex items-center gap-4">
                            <span className={`w-6 h-6 flex items-center justify-center rounded-xl text-[10px] font-black ${pekurban ? 'bg-brand-primary text-white' : 'bg-zinc-100 text-zinc-400'}`}>{slotNum}</span>
                            <span className={`text-sm font-black ${pekurban ? 'text-zinc-900' : 'italic text-zinc-400'}`}>
                              {pekurban ? pekurban.nama_pekurban : 'Slot Tersedia'}
                            </span>
                          </div>
                          {pekurban && (
                            <div className={`w-2 h-2 rounded-full ${pekurban.payment_status === 'Lunas' ? 'bg-brand-secondary shadow-[0_0_8px_rgba(5,150,105,0.5)]' : 'bg-brand-accent shadow-[0_0_8px_rgba(217,119,6,0.5)]'}`}></div>
                          )}
                        </div>
                      )
                    })
                  ) : (
                    <div className="p-6 rounded-[2rem] bg-brand-primary/5 border border-brand-primary/10">
                      {animal.pekurban_names.length > 0 ? (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-black text-brand-primary text-lg leading-tight uppercase">{animal.pekurban_names[0].nama_pekurban}</p>
                            <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mt-1 opacity-60">{animal.pekurban_names[0].asal_rt_rw}</p>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${animal.pekurban_names[0].payment_status === 'Lunas' ? 'bg-brand-secondary' : 'bg-brand-accent'}`}></div>
                        </div>
                      ) : (
                        <p className="text-center text-zinc-400 italic text-sm font-bold uppercase tracking-widest py-4">Menanti Pekurban</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {animal.photo_url && (
                <div className="relative h-56 w-full mt-4 bg-zinc-100 overflow-hidden group-hover:scale-105 transition-transform duration-700">
                   <img 
                    src={animal.photo_url} 
                    alt={`Dokumentasi ${animal.tag_number}`}
                    className="w-full h-full object-cover"
                   />
                </div>
              )}
              
              <div className="h-4 bg-brand-primary w-full mt-auto opacity-10 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
