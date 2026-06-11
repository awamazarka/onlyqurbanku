import { createClient } from '@/utils/supabase/server'
import StructureTreeClient from '@/components/StructureTreeClient'

export const revalidate = 3600 // Cache for 1 hour

export default async function StructurePage() {
  const supabase = await createClient()

  const { data: profiles, error } = await supabase
    .from('panitia_profile')
    .select('nama_lengkap, sub_tim, role')
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching panitia:', error)
    return <div className="text-center py-20 uppercase font-black text-zinc-400">Gagal memuat struktur organisasi</div>
  }

  return <StructureTreeClient profiles={profiles || []} />
}
