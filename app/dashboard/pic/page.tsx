import { getPanitiaProfile, createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import PicClient from '@/components/PicClient'

export default async function PicDashboardPage() {
  const panitia = await getPanitiaProfile()

  if (!panitia) {
    redirect('/login')
  }

  const supabase = await createClient()
  
  // Fetch animals
  const { data: animals } = await supabase
    .from('qurban_animals')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch tasks for this specific panitia
  const { data: tasks } = await supabase
    .from('panitia_tasks')
    .select('*')
    .eq('pic_id', panitia.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      <header className="mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Panel Lapangan</h1>
        <p className="text-[10px] font-bold text-zinc-500 uppercase">Halo, {panitia.nama_lengkap} • {panitia.sub_tim}</p>
      </header>

      <PicClient animals={animals || []} panitia={panitia} tasks={tasks || []} />
    </div>
  )
}
