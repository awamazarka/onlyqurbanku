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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
      <header className="mb-16 text-center space-y-4">
        <div className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-[0.2em]">
          Jadwal Pengajian & Acara
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-brand-primary tracking-tighter leading-none">
          Kegiatan <span className="text-brand-accent italic">Mushala</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-black text-brand-primary/60 uppercase tracking-[0.15em] leading-none">
          Mushala Raudhatul Muttaqin
        </h2>
        <p className="text-zinc-500 font-medium max-w-xl mx-auto italic mt-4">
          Ikuti berbagai kajian, tausiyah, dan kegiatan berjamaah di Mushala Raudhatul Muttaqin.
        </p>
      </header>

      <EventCalendarPublic events={events || []} />
    </div>
  )
}
