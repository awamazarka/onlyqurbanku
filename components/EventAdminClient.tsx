'use client'

import { useState, useTransition } from 'react'
import { addEvent, deleteEvent, updateEvent } from '@/app/dashboard/events/actions'

export default function EventAdminClient({ initialEvents }: { initialEvents: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any | null>(null)

  return (
    <div className="space-y-8">
      {!showForm ? (
        <button 
          onClick={() => { setEditingEvent(null); setShowForm(true); }}
          className="w-full bg-brand-primary text-white font-black py-4 rounded-3xl flex items-center justify-center gap-2 uppercase tracking-widest hover:bg-brand-primary/90 transition-colors"
        >
          <span className="text-xl">📅</span> TAMBAH EVENT BARU
        </button>
      ) : (
        <form 
          action={async (formData) => {
            startTransition(async () => {
              const res = editingEvent?.id 
                ? await updateEvent(formData)
                : await addEvent(formData)
                
              if (res.success) {
                setShowForm(false)
                setEditingEvent(null)
                alert(`Event berhasil ${editingEvent?.id ? 'diperbarui' : 'ditambahkan'}!`)
              } else {
                alert(res.error)
              }
            })
          }}
          className="bg-white p-8 rounded-[3rem] border border-zinc-100 shadow-2xl shadow-brand-primary/10 space-y-6 dark:bg-zinc-900 dark:border-zinc-800 relative overflow-hidden"
        >
          {editingEvent?.id && <input type="hidden" name="id" value={editingEvent.id} />}
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-xl text-brand-primary uppercase tracking-tighter">
              {editingEvent?.id ? '📝 Edit Data Event' : 'Input Data Event'}
            </h3>
            <button type="button" onClick={() => { setShowForm(false); setEditingEvent(null); }} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800">✕</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Nama Event</label>
              <input type="text" name="nama_event" defaultValue={editingEvent?.nama_event} required placeholder="Contoh: Pengajian Rutin" className="w-full mt-1 p-4 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold dark:bg-zinc-800 dark:text-white" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Tanggal</label>
                <input type="date" name="tanggal" defaultValue={editingEvent?.tanggal} required className="w-full mt-1 p-4 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold dark:bg-zinc-800 dark:text-white" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Jam</label>
                <input type="time" name="jam" defaultValue={editingEvent?.jam?.substring(0,5)} required className="w-full mt-1 p-4 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold dark:bg-zinc-800 dark:text-white" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Keterangan / Deskripsi</label>
              <textarea name="keterangan" defaultValue={editingEvent?.keterangan} rows={3} placeholder="Detail kegiatan..." className="w-full mt-1 p-4 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold resize-none dark:bg-zinc-800 dark:text-white"></textarea>
            </div>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50">
              <input type="checkbox" name="is_rutin" id="is_rutin" value="true" defaultChecked={editingEvent?.is_rutin} className="w-6 h-6 accent-brand-primary cursor-pointer" />
              <div className="flex flex-col">
                <label htmlFor="is_rutin" className="text-[10px] font-black uppercase text-brand-primary tracking-widest cursor-pointer">Kegiatan Rutin</label>
                <span className="text-[9px] font-bold text-zinc-500">Event akan otomatis diulang setiap minggu pada hari dan jam yang sama.</span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
                Upload Poster {editingEvent?.poster_url ? '(Biarkan kosong jika tidak ingin mengubah)' : '(Opsional)'}
              </label>
              <input type="file" name="poster" accept="image/*" className="w-full mt-1 p-4 bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold dark:bg-zinc-800 dark:text-white" />
            </div>
          </div>

          <button type="submit" disabled={isPending} className="w-full bg-brand-primary text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] active:scale-95 transition-transform disabled:opacity-70">
            {editingEvent?.id ? 'SIMPAN PERUBAHAN' : 'SIMPAN EVENT'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialEvents.map(event => (
          <div key={event.id} className="bg-white rounded-[2rem] border border-zinc-100 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 flex flex-col group relative">
            {event.is_rutin && (
              <div className="absolute top-4 left-4 z-10 bg-brand-accent text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                Rutin Tiap Pekan
              </div>
            )}
            {event.poster_url && (
              <div className="h-48 w-full bg-zinc-100 relative">
                <img src={event.poster_url} alt={event.nama_event} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-black text-lg text-brand-primary uppercase tracking-tighter leading-tight">{event.nama_event}</h4>
                  <p className="text-xs font-bold text-zinc-500 mt-1">
                    {new Date(event.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} • {event.jam.substring(0, 5)} WIB
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 mt-3 flex-1 dark:text-zinc-400">{event.keterangan || '-'}</p>
              
              <div className="mt-6 flex gap-2 w-full">
                <button 
                  onClick={() => {
                    setEditingEvent(event);
                    setShowForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={isPending}
                  className="flex-1 py-3 bg-zinc-100 text-zinc-600 text-xs font-black rounded-xl uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Hapus event ini?')) {
                      startTransition(() => deleteEvent(event.id))
                    }
                  }}
                  disabled={isPending}
                  className="flex-1 py-3 bg-red-50 text-red-600 text-xs font-black rounded-xl uppercase tracking-widest hover:bg-red-100 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
        {initialEvents.length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-400 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-zinc-200 rounded-[2rem]">
            Belum ada event yang didaftarkan.
          </div>
        )}
      </div>
    </div>
  )
}
