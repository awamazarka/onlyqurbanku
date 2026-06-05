'use client'

import { useState, useTransition, useEffect, useMemo } from 'react'
import { updatePayment, addCashflow, upsertPekurban, deletePekurban, updateCashflow, deleteCashflow, addInstallment } from '@/app/dashboard/finance/actions'
import * as XLSX from 'xlsx'

interface PaymentHistory {
  id: string
  date: string
  amount: number
}

interface Pekurban {
  id: string
  nama_pekurban: string
  no_whatsapp: string
  asal_rt_rw: string
  payment_status: string
  amount_paid: number
  biaya_potong_dibayar: boolean
  animal_id: string
  slot_number: number
  notes?: string
  qurban_animals: { id: string; tag_number: string; jenis_hewan: string; harga_per_slot: number }
}

interface Cashflow {
  id: string
  tipe: string
  kategori: string
  nominal: number
  keterangan: string
  created_at: string
}

interface Animal {
  id: string
  tag_number: string
  jenis_hewan: string
  harga_per_slot: number
}

export default function FinanceClient({ 
  pekurbans, 
  cashflows, 
  animals,
  panitiaId 
}: { 
  pekurbans: Pekurban[], 
  cashflows: Cashflow[], 
  animals: Animal[],
  panitiaId: string 
}) {
  const [activeTab, setActiveTab] = useState<'payments' | 'cashbook' | 'manage'>('payments')
  const [isPending, startTransition] = useTransition()
  const [editingPekurban, setEditingPekurban] = useState<Partial<Pekurban> | null>(null)
  const [editingCashflow, setEditingCashflow] = useState<Partial<Cashflow> | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showCashflowForm, setShowCashflowForm] = useState(false)
  const [installmentFormId, setInstallmentFormId] = useState<string | null>(null)
  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({})
  const [filterAnimalId, setFilterAnimalId] = useState<string>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleHistory = (id: string) => {
    setExpandedHistory(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredPekurbans = useMemo(() => {
    if (filterAnimalId === 'all') return pekurbans
    return pekurbans.filter(p => p.animal_id === filterAnimalId)
  }, [pekurbans, filterAnimalId])

  const monthlySummary = useMemo(() => {
    const summary: Record<string, { in: number; out: number }> = {}
    cashflows.forEach(cf => {
      const date = new Date(cf.created_at)
      const monthYear = date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
      if (!summary[monthYear]) summary[monthYear] = { in: 0, out: 0 }
      
      if (cf.tipe === 'Pemasukan') {
        summary[monthYear].in += cf.nominal
      } else {
        summary[monthYear].out += cf.nominal
      }
    })
    return summary
  }, [cashflows])

  const handleExportExcel = () => {
    const dataToExport = cashflows.map(cf => {
      const date = new Date(cf.created_at)
      
      const dateFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })

      const timeFormatter = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      })

      return {
        Tanggal: dateFormatter.format(date),
        Waktu: `${timeFormatter.format(date).replace(/\./g, ':')} WIB`,
        Tipe: cf.tipe,
        Kategori: cf.kategori,
        Keterangan: cf.keterangan || '-',
        Nominal: cf.nominal
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Buku Kas')
    XLSX.writeFile(workbook, `Buku_Kas_Qurban_${new Date().getTime()}.xlsx`)
  }

  const handleExportExcelPayments = () => {
    const dataToExport = pekurbans.map(p => {
      let historyText = '-'
      try {
        if (p.notes) {
          const history: PaymentHistory[] = JSON.parse(p.notes)
          if (Array.isArray(history) && history.length > 0) {
            historyText = history.map(h => `${h.date}: Rp${h.amount.toLocaleString('id-ID')}`).join(' | ')
          }
        }
      } catch (e) {}

      return {
        Hewan: p.qurban_animals?.tag_number,
        Slot: p.slot_number,
        Nama: p.nama_pekurban,
        WhatsApp: p.no_whatsapp,
        Asal: p.asal_rt_rw,
        Status: p.payment_status,
        Total_Bayar: p.amount_paid,
        Biaya_Potong: p.biaya_potong_dibayar ? 'Lunas' : 'Belum',
        Riwayat_Cicilan: historyText
      }
    })

    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Iuran Pekurban')
    XLSX.writeFile(workbook, `Iuran_Pekurban_${new Date().getTime()}.xlsx`)
  }

  const generateReceipt = (p: Pekurban) => {
    const text = `*KWITANSI DIGITAL QURBANKUY*\n\nTerima kasih kepada:\n*${p.nama_pekurban}*\n(${p.asal_rt_rw})\n\nAtas pembayaran Qurban untuk hewan:\n*${p.qurban_animals.tag_number}*\n\nStatus: *LUNAS*\nTotal Bayar: Rp${(p.amount_paid).toLocaleString('id-ID')}\nBiaya Potong: ${p.biaya_potong_dibayar ? 'LUNAS' : 'BELUM'}\nTanggal: ${new Date().toLocaleDateString('id-ID')}\n\n_Semoga menjadi amal ibadah yang diterima Allah SWT. Amin._`
    const encoded = encodeURIComponent(text)
    
    let phone = p.no_whatsapp || ''
    if (phone && !phone.startsWith('62')) {
      if (phone.startsWith('0')) phone = '62' + phone.substring(1)
      else if (!phone.startsWith('+')) phone = '62' + phone
    }
    phone = phone.replace(/\D/g, '')
    
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
  }

  const handleDelete = (id: string) => {
    if (confirm('Hapus data pekurban ini?')) {
      startTransition(() => deletePekurban(id))
    }
  }

  const handleEdit = (p: Pekurban) => {
    setEditingPekurban(p)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditCashflow = (cf: Cashflow) => {
    setEditingCashflow(cf)
    setShowCashflowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteCashflow = (id: string) => {
    if (confirm('Hapus catatan kas ini?')) {
      startTransition(() => deleteCashflow(id))
    }
  }

  const getAvailableSlots = (animalId: string, currentId?: string) => {
    if (!animalId) return []
    const animal = animals.find(a => a.id === animalId)
    if (!animal) return []

    const maxSlots = animal.jenis_hewan === 'Sapi' ? 7 : 1
    const occupiedSlots = pekurbans
      .filter(p => p.animal_id === animalId && p.id !== currentId)
      .map(p => p.slot_number)

    const available = []
    for (let i = 1; i <= maxSlots; i++) {
      if (!occupiedSlots.includes(i)) {
        available.push(i)
      }
    }
    return available
  }

  if (!mounted) return <div className="p-20 text-center animate-pulse text-zinc-400">🌙 Memuat data Keuangan...</div>

  return (
    <div className="space-y-6 pb-32">
      {/* Tab Navigation - Optimized for Mobile */}
      <div className="flex bg-white p-1 rounded-[1.5rem] shadow-lg shadow-emerald-900/5 sticky top-20 z-10 border border-zinc-100 mx-1">
        {[
          { id: 'payments', label: 'Iuran', icon: '💰' },
          { id: 'manage', label: 'Pekurban', icon: '👥' },
          { id: 'cashbook', label: 'Buku Kas', icon: '📖' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 px-1 text-[9px] font-black uppercase tracking-tighter rounded-xl flex flex-col items-center gap-1 transition-all ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-md' : 'text-zinc-400 hover:text-brand-primary'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'manage' && (
        <div className="space-y-6 px-1">
          {/* Action Button */}
          {!showForm ? (
            <button 
              onClick={() => { setEditingPekurban(null); setShowForm(true); }}
              className="islamic-btn-primary w-full flex items-center justify-center gap-3 text-sm py-4 rounded-3xl"
            >
              <span className="text-xl">✨</span> DAFTAR PEKURBAN BARU
            </button>
          ) : (
            <div className="bg-white p-6 rounded-[2.5rem] border-4 border-brand-primary shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                <h3 className="font-black text-lg text-brand-primary uppercase tracking-tighter">
                  {editingPekurban?.id ? '📝 Edit Data' : '🕌 Registrasi'}
                </h3>
                <button onClick={() => setShowForm(false)} className="w-10 h-10 bg-zinc-50 text-zinc-400 rounded-full flex items-center justify-center hover:bg-zinc-100">✕</button>
              </div>

              <form action={async (formData) => {
                const animal = animals.find(a => a.id === formData.get('animal_id'))
                const amount = parseFloat(formData.get('amount_paid') as string || '0')
                const biayaLunas = formData.get('biaya_potong_dibayar') === 'true'
                
                if (animal && amount >= animal.harga_per_slot && biayaLunas) {
                  formData.set('payment_status', 'Lunas')
                } else if (amount > 0) {
                  formData.set('payment_status', 'Cicil')
                } else {
                  formData.set('payment_status', 'Belum Bayar')
                }

                const res = await upsertPekurban(formData)
                if (res.success) {
                  setEditingPekurban(null)
                  setShowForm(false)
                } else {
                  alert(res.error)
                }
              }} className="space-y-5">
                {editingPekurban?.id && <input type="hidden" name="id" value={editingPekurban.id} />}
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Hewan</label>
                    <select 
                      name="animal_id" 
                      value={editingPekurban?.animal_id || ''}
                      onChange={(e) => setEditingPekurban({ ...editingPekurban, animal_id: e.target.value })}
                      required 
                      className="w-full p-4 text-xs font-black bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
                    >
                      <option value="">Pilih</option>
                      {animals.map(a => (
                        <option key={a.id} value={a.id}>{a.tag_number}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Slot</label>
                    <select 
                      name="slot_number" 
                      value={editingPekurban?.slot_number || ''}
                      onChange={(e) => setEditingPekurban({ ...editingPekurban, slot_number: parseInt(e.target.value) })}
                      required 
                      className="w-full p-4 text-xs font-black bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary appearance-none"
                    >
                      <option value="">Slot</option>
                      {editingPekurban?.animal_id && getAvailableSlots(editingPekurban.animal_id, editingPekurban?.id).map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                      {editingPekurban?.id && editingPekurban?.animal_id && !getAvailableSlots(editingPekurban.animal_id, editingPekurban.id).includes(editingPekurban.slot_number!) && (
                         <option value={editingPekurban.slot_number}>{editingPekurban.slot_number}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Nama Lengkap</label>
                  <input name="nama_pekurban" defaultValue={editingPekurban?.nama_pekurban} placeholder="..." required className="w-full p-4 text-sm font-black bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">WhatsApp</label>
                    <input name="no_whatsapp" type="tel" defaultValue={editingPekurban?.no_whatsapp} placeholder="08..." className="w-full p-4 text-sm font-black bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Asal RT/RW</label>
                    <input name="asal_rt_rw" defaultValue={editingPekurban?.asal_rt_rw} placeholder="..." required className="w-full p-4 text-sm font-black bg-zinc-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" />
                  </div>
                </div>

                <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 space-y-4">
                  <p className="text-[9px] font-black uppercase text-emerald-600 tracking-[0.2em]">💰 SISTEM TABUNGAN</p>
                  <input name="amount_paid" type="number" defaultValue={editingPekurban?.amount_paid || 0} className="w-full p-4 text-2xl font-black bg-white border-none rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary text-brand-primary" />
                  <div className="flex items-center gap-3">
                    <input type="checkbox" name="biaya_potong_dibayar" id="biaya_check" value="true" defaultChecked={editingPekurban?.biaya_potong_dibayar} className="w-6 h-6 accent-brand-primary" />
                    <label htmlFor="biaya_check" className="text-[10px] font-black text-brand-primary uppercase">Biaya Potong Lunas</label>
                  </div>
                </div>

                <button type="submit" disabled={isPending} className="islamic-btn-primary w-full py-5 text-sm uppercase tracking-widest">
                  {editingPekurban?.id ? 'SIMPAN PERUBAHAN' : 'KONFIRMASI PENDAFTARAN'}
                </button>
              </form>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex justify-between items-center px-4">
               <h3 className="font-black text-[10px] uppercase text-zinc-400 tracking-widest">Data Terdaftar</h3>
               <select value={filterAnimalId} onChange={(e) => setFilterAnimalId(e.target.value)} className="text-[9px] font-black bg-white border border-zinc-100 rounded-lg px-3 py-1.5 outline-none shadow-sm">
                 <option value="all">Semua</option>
                 {animals.map(a => <option key={a.id} value={a.id}>{a.tag_number}</option>)}
               </select>
            </div>
            {filteredPekurbans.map(p => (
              <div key={p.id} className="bg-white p-5 rounded-[2.2rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 group">
                <div className="flex justify-between items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                       <span className="text-[7px] font-black bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full uppercase">{p.qurban_animals?.tag_number}</span>
                       <span className="text-[7px] font-black bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded-full uppercase">Slot {p.slot_number}</span>
                    </div>
                    <p className="text-lg font-black text-brand-primary truncate leading-none mb-1">{p.nama_pekurban}</p>
                    <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-tighter">{p.asal_rt_rw}</p>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button onClick={() => handleEdit(p)} className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center active:scale-90 transition-all border border-emerald-100/50 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="w-11 h-11 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center active:scale-90 transition-all border border-amber-100/50 shadow-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="grid gap-4 px-2">
          <header className="mb-2 px-2 flex justify-between items-end">
            <div>
               <h3 className="font-black text-xl text-brand-primary tracking-tight uppercase leading-none">Kontrol Iuran</h3>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Konfirmasi & Kirim Kwitansi WA</p>
            </div>
            <button 
              onClick={handleExportExcelPayments}
              className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              EXPORT
            </button>
          </header>
          {pekurbans.map(p => {
            const isLunas = p.payment_status === 'Lunas'
            const hargaSlot = p.qurban_animals?.harga_per_slot || 0
            const sisa = hargaSlot - p.amount_paid
            
            let history: PaymentHistory[] = []
            if (p.notes) {
              try { history = JSON.parse(p.notes) } catch (e) {}
            }

            return (
              <div key={p.id} className="bg-white p-7 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
                {isLunas && <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-brand-primary/5 rounded-full flex items-end justify-start p-6 text-brand-primary text-xl">✓</div>}
                
                <div className="flex justify-between items-start mb-6">
                  <div className="w-full">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full shadow-sm tracking-widest ${isLunas ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-accent/10 text-brand-accent'}`}>
                        {isLunas ? 'LUNAS' : `SISA RP ${sisa.toLocaleString('id-ID')}`}
                      </span>
                      <span className="text-[10px] font-black px-3 py-1 rounded-full bg-zinc-100 text-zinc-500 tracking-widest">
                        TOTAL: RP {hargaSlot.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <h3 className="font-black text-2xl text-brand-primary leading-none">{p.nama_pekurban}</h3>
                    <div className="mt-4 space-y-1">
                      <p className="text-[11px] font-bold text-zinc-600 uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary"></span>
                        Terbayar: <span className="text-brand-primary">Rp {p.amount_paid.toLocaleString('id-ID')}</span>
                      </p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${p.biaya_potong_dibayar ? 'bg-emerald-500' : 'bg-zinc-300'}`}></span>
                        Biaya Potong: {p.biaya_potong_dibayar ? 'LUNAS (Rp 150rb)' : 'BELUM BAYAR'}
                      </p>
                    </div>
                    <p className="text-[9px] font-black text-zinc-300 uppercase mt-4 tracking-[0.2em] mb-4">{p.qurban_animals?.tag_number} • {p.asal_rt_rw}</p>

                    {/* Riwayat Cicilan */}
                    {history.length > 0 && (
                      <div className="bg-zinc-50 rounded-2xl p-4 mt-2 border border-zinc-100 mb-4">
                        <div className="flex justify-between items-center mb-2 cursor-pointer group" onClick={() => toggleHistory(p.id)}>
                          <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest group-hover:text-brand-primary transition-colors">Riwayat Pembayaran</p>
                          <svg className={`w-4 h-4 text-zinc-400 transition-transform ${expandedHistory[p.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                        <div className="space-y-2">
                          {expandedHistory[p.id] ? (
                            history.map((h, i) => (
                              <div key={h.id || i} className="flex justify-between items-center">
                                <span className="text-xs font-bold text-zinc-600">{new Date(h.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span className="text-xs font-black text-emerald-600">+ Rp{h.amount.toLocaleString('id-ID')}</span>
                              </div>
                            ))
                          ) : (
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-zinc-600">Latest: {new Date(history[history.length - 1].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span className="text-xs font-black text-emerald-600">+ Rp{history[history.length - 1].amount.toLocaleString('id-ID')}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {installmentFormId === p.id ? (
                  <form action={async (formData) => {
                    const res = await addInstallment(formData)
                    if (res.success) {
                      setInstallmentFormId(null)
                    } else {
                      alert(res.error)
                    }
                  }} className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100 space-y-4 animate-in fade-in duration-300">
                    <input type="hidden" name="id" value={p.id} />
                    <div>
                      <label className="text-[9px] font-black uppercase text-emerald-600 tracking-widest ml-1">Tanggal</label>
                      <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full mt-1 p-3 text-sm font-bold bg-white border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase text-emerald-600 tracking-widest ml-1">Nominal Tambahan</label>
                      <input type="number" name="amount" required placeholder="Rp 0" max={sisa} className="w-full mt-1 p-3 text-lg font-black bg-white border-none rounded-xl outline-none focus:ring-2 focus:ring-brand-primary text-brand-primary" />
                      <p className="text-[9px] text-emerald-500 mt-1 ml-1 font-bold">Maksimal: Rp{sisa.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" disabled={isPending} className="flex-1 bg-brand-primary text-white font-black py-3 rounded-xl uppercase text-[10px] tracking-widest active:scale-95 transition-transform">
                        Simpan
                      </button>
                      <button type="button" onClick={() => setInstallmentFormId(null)} className="px-4 bg-zinc-200 text-zinc-600 font-black py-3 rounded-xl uppercase text-[10px] tracking-widest active:scale-95 transition-transform">
                        Batal
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-3">
                    {!isLunas ? (
                      <button 
                        onClick={() => setInstallmentFormId(p.id)} 
                        className="flex-1 bg-brand-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-900/20 uppercase text-xs tracking-widest active:scale-95 transition-transform"
                      >
                        TAMBAH CICILAN
                      </button>
                    ) : (
                      <button onClick={() => generateReceipt(p)} className="flex-1 bg-zinc-900 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest active:scale-95 transition-transform">
                        <span className="text-lg">📩</span> KIRIM KWITANSI WA
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'cashbook' && (
        <div className="space-y-8 px-1">
          {!showCashflowForm ? (
            <button 
              onClick={() => { setEditingCashflow(null); setShowCashflowForm(true); }}
              className="islamic-btn-primary w-full flex items-center justify-center gap-3 text-sm py-4 rounded-3xl"
            >
              <span className="text-xl">💸</span> INPUT KAS OPERASIONAL
            </button>
          ) : (
            <div className="bg-brand-primary p-8 rounded-[3rem] shadow-2xl shadow-emerald-900/40 space-y-6 text-white relative overflow-hidden animate-in slide-in-from-top-4 duration-500">
              <div className="flex justify-between items-center border-b border-white/20 pb-4">
                <h3 className="font-black text-lg uppercase tracking-tighter flex items-center gap-3">
                  {editingCashflow?.id ? '📝 Edit Transaksi' : '💸 Transaksi Baru'}
                </h3>
                <button onClick={() => setShowCashflowForm(false)} className="w-10 h-10 bg-white/10 text-white/70 rounded-full flex items-center justify-center hover:bg-white/20">✕</button>
              </div>

              <form action={async (formData) => {
                let res;
                if (editingCashflow?.id) {
                  res = await updateCashflow(formData);
                } else {
                  res = await addCashflow(formData, panitiaId);
                }
                
                if (res.success) { 
                  setShowCashflowForm(false);
                  setEditingCashflow(null);
                } else {
                  alert(res.error)
                }
              }} className="space-y-6 relative z-10">
                {editingCashflow?.id && <input type="hidden" name="id" value={editingCashflow.id} />}
                
                <div className="grid grid-cols-2 gap-4">
                  <select name="tipe" defaultValue={editingCashflow?.tipe || 'Pemasukan'} className="p-4 text-sm font-black bg-emerald-900/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-white/50 appearance-none text-white">
                    <option value="Pemasukan">Pemasukan (+)</option>
                    <option value="Pengeluaran">Pengeluaran (-)</option>
                  </select>
                  <input name="kategori" defaultValue={editingCashflow?.kategori} placeholder="Kategori" required className="p-4 text-sm font-black bg-emerald-900/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-white/50 placeholder-emerald-100/30 text-white" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-emerald-200 ml-1">Keterangan Tambahan</label>
                  <input name="keterangan" defaultValue={editingCashflow?.keterangan} placeholder="Opsional" className="w-full p-4 text-sm font-black bg-emerald-900/50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-white/50 placeholder-emerald-100/30 text-white" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-emerald-200 ml-1">Nominal (Rupiah)</label>
                  <input name="nominal" type="number" defaultValue={editingCashflow?.nominal} placeholder="Rp 0" required className="w-full p-6 text-4xl font-black bg-emerald-900/50 border-none rounded-[2rem] outline-none focus:ring-2 focus:ring-white/50 placeholder-emerald-100/20 text-white" />
                </div>

                <button type="submit" disabled={isPending} className="w-full bg-brand-accent text-white font-black py-5 rounded-[2rem] shadow-xl shadow-amber-900/40 uppercase tracking-[0.2em] active:scale-95 transition-transform">
                  SIMPAN TRANSAKSI
                </button>
              </form>
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full blur-3xl z-0 pointer-events-none"></div>
            </div>
          )}

          <div className="space-y-6 px-2">
            <div className="flex justify-between items-end">
              <h3 className="font-black text-xs uppercase text-zinc-400 tracking-[0.2em]">Ringkasan Bulanan</h3>
              <button 
                onClick={handleExportExcel}
                className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-100 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                EXPORT EXCEL
              </button>
            </div>
            
            <div className="grid gap-3">
              {Object.entries(monthlySummary).map(([month, data]) => (
                <div key={month} className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100 flex justify-between items-center shadow-sm">
                  <p className="font-black text-sm text-zinc-700">{month}</p>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase">In: Rp{data.in.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] font-bold text-amber-600 uppercase">Out: Rp{data.out.toLocaleString('id-ID')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 px-2">
            <h3 className="font-black text-xs uppercase text-zinc-400 tracking-[0.2em] mt-8">Riwayat Kas Terbaru</h3>
            <div className="grid gap-3">
              {cashflows.map(cf => (
                <div key={cf.id} className="bg-white p-6 rounded-3xl border border-zinc-50 shadow-lg shadow-emerald-900/5 flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${cf.tipe === 'Pemasukan' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-brand-accent'}`}>
                       {cf.tipe === 'Pemasukan' ? 'IN' : 'OUT'}
                     </div>
                     <div>
                       <p className="font-black text-brand-primary text-lg leading-none">{cf.kategori}</p>
                       <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mt-1">{new Date(cf.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-black text-xl ${cf.tipe === 'Pemasukan' ? 'text-emerald-600' : 'text-brand-accent'}`}>
                      {cf.tipe === 'Pemasukan' ? '+' : '-'} Rp{cf.nominal.toLocaleString('id-ID')}
                    </p>
                    <div className="flex flex-col gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditCashflow(cf)} className="text-emerald-600 p-1 bg-emerald-50 rounded-md hover:bg-emerald-100">
                         <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                      <button onClick={() => handleDeleteCashflow(cf.id)} className="text-amber-600 p-1 bg-amber-50 rounded-md hover:bg-amber-100">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


