import { createClient } from '@/utils/supabase/server'
import MonitoringClient from '@/components/MonitoringClient'

export const revalidate = 60 // Revalidate every minute

export default async function HomePage() {
  const supabase = await createClient()
  
  // Fetch animals with their related pekurban names
  const { data: animals, error } = await supabase
    .from('qurban_animals')
    .select(`
      *,
      pekurban_names (*)
    `)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching animals:', error)
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-medium">Gagal memuat data monitoring.</p>
      </div>
    )
  }

  return <MonitoringClient animals={animals || []} />
}
