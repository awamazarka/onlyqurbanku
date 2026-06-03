import { getPanitiaProfile, createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import FinanceClient from '@/components/FinanceClient'

export default async function FinanceDashboardPage() {
  const panitia = await getPanitiaProfile()

  if (!panitia) {
    redirect('/login')
  }

  // Permission Check: Only Admin or Bendahara sub-team
  if (panitia.role !== 'admin' && panitia.sub_tim !== 'Bendahara') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-red-600 mb-2">Akses Ditolak</h1>
        <p className="text-zinc-500">Anda tidak memiliki izin untuk mengakses area Keuangan.</p>
        <a href="/dashboard" className="mt-4 inline-block text-green-600 font-medium underline">Kembali ke Dashboard</a>
      </div>
    )
  }

  const supabase = await createClient()

  // Fetch Pekurbans with animal info (including price)
  const { data: pekurbans } = await supabase
    .from('pekurban_names')
    .select('*, qurban_animals(tag_number, harga_per_slot)')
    .order('created_at', { ascending: false })

  // Fetch Cashflow history
  const { data: cashflows } = await supabase
    .from('operational_cashflow')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch All Animals for assignment (including price)
  const { data: animals } = await supabase
    .from('qurban_animals')
    .select('id, tag_number, jenis_hewan, harga_per_slot')
    .order('tag_number', { ascending: true })

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-2xl font-black">Panel Keuangan</h1>
        <p className="text-sm text-zinc-500">Bendahara: {panitia.nama_lengkap}</p>
      </header>

      <FinanceClient 
        pekurbans={pekurbans || []} 
        cashflows={cashflows || []} 
        animals={animals || []}
        panitiaId={panitia.id} 
      />
    </div>
  )
}
