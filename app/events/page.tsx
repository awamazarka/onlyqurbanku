import { createClient } from '@/utils/supabase/server'
import EventCalendarPublic from '@/components/EventCalendarPublic'

export const revalidate = 60 // Revalidate every minute

export default async function EventsPage() {
  const supabase = await createClient()

  // Ambil semua event, public view bisa memfilter di client
  const { data: events } = await supabase
    .from('mushala_events')
    .select('*')
    .order('tanggal', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-brand-primary">
          Kegiatan Mushala
        </h1>
        <p className="text-zinc-500 mt-4 text-lg">
          Ikuti berbagai kajian, tausiyah, dan kegiatan berjamaah di Mushala Raudhatul Muttaqin.
        </p>
      </header>

      <EventCalendarPublic events={events || []} />
    </div>
  )
}
