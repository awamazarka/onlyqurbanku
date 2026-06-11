import { createClient, getPanitiaProfile } from '@/utils/supabase/server'
import CommitteeMonitoringClient from '@/components/CommitteeMonitoringClient'
import { redirect } from 'next/navigation'

export const revalidate = 60 // Revalidate every minute

export default async function PublicPanitiaPage() {
  const panitia = await getPanitiaProfile()

  if (!panitia) {
    redirect('/login')
  }

  const supabase = await createClient()

  // Fetch all panitia profiles and their tasks
  const { data: profiles, error } = await supabase
    .from('panitia_profile')
    .select(`
      *,
      panitia_tasks (*)
    `)
    .order('sub_tim', { ascending: true })

  if (error) {
    console.error('Error fetching panitia:', error)
    return (
      <div className="text-center py-20 text-red-500">
        Gagal memuat data monitoring panitia.
      </div>
    )
  }

  return <CommitteeMonitoringClient profiles={profiles || []} />
}
