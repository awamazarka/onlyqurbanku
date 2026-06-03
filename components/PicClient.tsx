'use client'

import { useState, useTransition } from 'react'
import { updateAnimalStatus, uploadAnimalPhoto, addAnimal, updateTaskStatus, updateAnimalPrice } from '@/app/dashboard/pic/actions'

export default function PicClient({ 
  animals, 
  panitia, 
  tasks 
}: { 
  animals: any[], 
  panitia: any, 
  tasks: any[] 
}) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'view' | 'add'>('tasks')
  const [isPending, startTransition] = useTransition()
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null)

  const handlePriceUpdate = (id: string, formData: FormData) => {
    const price = parseFloat(formData.get('price') as string)
    if (isNaN(price)) return
    
    startTransition(async () => {
      await updateAnimalPrice(id, price)
      setEditingPriceId(null)
      alert('Harga berhasil diperbarui!')
    })
  }

  const handleTaskUpdate = (taskId: string, currentStatus: string) => {
    const statuses = ['Belum Mulai', 'Sedang Dikerjakan', 'Selesai']
    const currentIndex = statuses.indexOf(currentStatus)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]
    
    startTransition(() => updateTaskStatus(taskId, nextStatus))
  }

  const handlePhotoUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>, shouldFinish: boolean = false) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    startTransition(async () => {
      try {
        await uploadAnimalPhoto(id, formData, shouldFinish)
        alert(shouldFinish ? 'Foto berhasil diunggah dan status diselesaikan!' : 'Foto hewan berhasil diperbarui!')
      } catch (err: any) {
        alert('Gagal unggah: ' + err.message)
      }
    })
  }

  return (
    <div className="space-y-8 pb-32">
      {/* Navigation Tabs - Islamic Style */}
      <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl shadow-emerald-900/5 sticky top-4 z-20 border border-zinc-50">
        {[
          { id: 'tasks', label: 'Tugas', icon: '📋' },
          { id: 'view', label: 'Hewan', icon: '🐄' },
          { id: 'add', label: 'Input', icon: '➕' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 px-2 text-[10px] font-black uppercase tracking-widest rounded-2xl flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-lg shadow-emerald-900/20' : 'text-zinc-400 hover:text-brand-primary'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <header className="px-4">
             <h3 className="font-black text-2xl text-brand-primary tracking-tighter uppercase leading-none">Tugas Saya</h3>
             <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mt-1">Amanah Tim Lapangan</p>
          </header>
          
          {tasks.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-zinc-100">
              <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">Belum ada tugas khusus</p>
            </div>
          ) : (
            <div className="grid gap-4 px-2">
              {tasks.map(task => (
                <div key={task.id} className="bg-white p-6 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="font-black text-xl text-brand-primary leading-tight">{task.task_name}</h4>
                      <p className="text-[9px] font-bold text-zinc-400 mt-1.5 uppercase">Update: {new Date(task.updated_at).toLocaleTimeString()}</p>
                    </div>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${task.status_tugas === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : task.status_tugas === 'Sedang Dikerjakan' ? 'bg-blue-100 text-blue-700' : 'bg-brand-accent/10 text-brand-accent'}`}>
                      {task.status_tugas}
                    </span>
                  </div>
                  
                  <button 
                    disabled={isPending}
                    onClick={() => handleTaskUpdate(task.id, task.status_tugas)}
                    className="w-full py-4 bg-zinc-900 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-transform"
                  >
                    {task.status_tugas === 'Selesai' ? 'RE-OPEN AMANAH' : 'UPDATE PROGRES'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Add Animal */}
      {activeTab === 'add' && (
        <div className="px-2">
          <form action={async (formData) => {
            const res = await addAnimal(formData)
            if (res.success) { setActiveTab('view'); alert('Hewan berhasil ditambahkan'); }
            else { alert(res.error); }
          }} className="bg-brand-primary p-8 rounded-[3rem] shadow-2xl shadow-emerald-900/40 space-y-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
            <h3 className="font-black text-xl uppercase tracking-tighter">🐄 DAFTARKAN HEWAN</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-emerald-200 ml-1">Tag Number</label>
                <input name="tag_number" required placeholder="SP01 / KB01" className="w-full p-4 text-sm font-black bg-emerald-900/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-white/50 placeholder-emerald-100/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-emerald-200 ml-1">Jenis</label>
                  <select name="jenis_hewan" className="w-full p-4 text-sm font-black bg-emerald-900/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-white/50 appearance-none">
                    <option value="Sapi">Sapi</option>
                    <option value="Kambing">Kambing</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-emerald-200 ml-1">Tipe</label>
                  <input name="tipe_jenis" placeholder="Limosin/Jawa" className="w-full p-4 text-sm font-black bg-emerald-900/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-white/50 placeholder-emerald-100/20" />
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-brand-accent text-white font-black py-5 rounded-[2rem] shadow-xl uppercase tracking-[0.2em] active:scale-95 transition-transform">
              SIMPAN DATA HEWAN
            </button>
          </form>
        </div>
      )}

      {/* Tab: Animal List */}
      {activeTab === 'view' && (
        <div className="space-y-6 px-2">
          {animals.map(animal => (
            <div key={animal.id} className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 overflow-hidden flex flex-col">
              <div className="p-7 pb-4">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-black text-3xl text-brand-primary tracking-tighter uppercase leading-none">{animal.tag_number}</h3>
                    <p className="text-[10px] font-black text-brand-accent uppercase tracking-widest mt-1">{animal.tipe_jenis || animal.jenis_hewan}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <span className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">STATUS FISIK</span>
                     <span className="px-3 py-1 bg-zinc-50 text-zinc-900 text-[10px] font-black rounded-full border border-zinc-100 uppercase tracking-tighter">
                       {animal.status_hewan}
                     </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Price Section */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black uppercase text-emerald-600/50 tracking-widest leading-none mb-1">Harga Per Slot</p>
                        <p className="text-lg font-black text-brand-primary leading-none">Rp{(animal.harga_per_slot || 0).toLocaleString('id-ID')}</p>
                      </div>
                      <button onClick={() => setEditingPriceId(editingPriceId === animal.id ? null : animal.id)} className="w-8 h-8 bg-white text-brand-primary rounded-xl flex items-center justify-center shadow-sm hover:bg-brand-primary hover:text-white transition-all">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                    {editingPriceId === animal.id && (
                      <form action={(formData) => handlePriceUpdate(animal.id, formData)} className="mt-4 flex gap-2">
                        <input name="price" type="number" defaultValue={animal.harga_per_slot} className="flex-1 p-3 text-sm font-black bg-white border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
                        <button type="submit" disabled={isPending} className="px-4 bg-brand-primary text-white text-[10px] font-black rounded-xl uppercase tracking-widest">Simpan</button>
                      </form>
                    )}
                  </div>

                  {animal.photo_url && (
                    <div className="relative h-48 w-full rounded-[2rem] overflow-hidden bg-zinc-100 shadow-inner">
                      <img src={animal.photo_url} alt="Foto Hewan" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1.5 px-1">
                      <label className="text-[9px] font-black uppercase text-zinc-400 tracking-[0.2em]">Kondisi Hewan</label>
                      <select 
                        disabled={isPending}
                        value={animal.status_hewan}
                        onChange={(e) => startTransition(() => updateAnimalStatus(animal.id, e.target.value))}
                        className="w-full p-4 text-xs font-black uppercase bg-zinc-100 border-none rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900 transition-all appearance-none"
                      >
                        <option value="Belum Datang">Belum Datang</option>
                        <option value="Di Kandang">Di Kandang</option>
                        <option value="Siap Sembelih">Siap Sembelih</option>
                        <option value="Selesai Sembelih">Selesai Sembelih</option>
                      </select>
                    </div>

                    <div className="grid gap-2">
                      <div className="relative">
                        <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload(animal.id, e, false)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <button className="w-full bg-zinc-900 text-white text-[10px] font-black py-4 rounded-2xl uppercase tracking-[0.2em] active:scale-95 transition-transform">
                          {animal.photo_url ? '🔄 Ganti Foto' : '📸 Upload Foto Hidup'}
                        </button>
                      </div>

                      {animal.status_hewan !== 'Selesai Sembelih' && (
                        <div className="relative">
                          <input type="file" accept="image/*" capture="environment" onChange={(e) => handlePhotoUpload(animal.id, e, true)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <button className="w-full bg-brand-secondary text-white text-[10px] font-black py-4 rounded-2xl uppercase tracking-[0.2em] shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform">
                            🔪 SELESAI & FOTO
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
