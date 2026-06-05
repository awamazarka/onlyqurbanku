import { getPanitiaProfile, createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import EventAdminClient from '@/components/EventAdminClient'

export default async function EventsDashboardPage() {
  const admin = await getPanitiaProfile()

  // Only allow admin
  if (!admin || admin.role !== 'admin') {
    redirect('/dashboard')
  }

  const supabase = await createClient()

  const { data: events } = await supabase
    .from('mushala_events')
    .select('*')
    .order('tanggal', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 dark:text-white">
          Manajemen Event Mushala
        </h1>
        <p className="text-zinc-500">Kelola kalender kegiatan Mushala Raudhatul Muttaqin.</p>
      </header>

      <EventAdminClient initialEvents={events || []} />
    </div>
  )
}
