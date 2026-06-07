'use client'

import { useState } from 'react'

export default function EventCalendarPublic({ events }: { events: any[] }) {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Swipe handlers
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      // Swiped Left (finger moved left) -> Next Month
      nextMonth()
    }
    if (distance < -minSwipeDistance) {
      // Swiped Right (finger moved right) -> Prev Month
      prevMonth()
    }
  }

  // Get current month events
  const currentMonthEvents: any[] = []
  
  events.forEach(e => {
    const eventDate = new Date(e.tanggal)
    
    if (e.is_rutin) {
      // Find all weekly occurrences for the current month
      const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      const endOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      
      let currentInstance = new Date(eventDate)
      
      // Fast forward to current month if the event started in the past
      while (currentInstance < startOfCurrentMonth && currentInstance < endOfCurrentMonth) {
        currentInstance.setDate(currentInstance.getDate() + 7)
      }
      
      while (currentInstance <= endOfCurrentMonth) {
        // Only add if the instance falls within the current month being viewed AND is on or after the original start date
        if (currentInstance >= eventDate && currentInstance.getMonth() === currentDate.getMonth()) {
           const instanceStr = `${currentInstance.getFullYear()}-${String(currentInstance.getMonth() + 1).padStart(2, '0')}-${String(currentInstance.getDate()).padStart(2, '0')}`
           // Push a clone of the event with the modified instance date
           currentMonthEvents.push({ ...e, tanggal: instanceStr, original_id: e.id })
        }
        currentInstance.setDate(currentInstance.getDate() + 7)
      }
    } else {
      // Non-recurring event
      if (eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear()) {
        currentMonthEvents.push(e)
      }
    }
  })

  // Group events by date for a simple calendar view or list
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i)

  return (
    <div className="space-y-8">
      <div 
        className="bg-white p-6 md:p-8 rounded-[3rem] border border-zinc-100 shadow-2xl shadow-emerald-900/5 dark:bg-zinc-900 dark:border-zinc-800 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEndHandler}
      >
        <div className="flex justify-between items-center mb-8">
          <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl sm:text-2xl font-black text-brand-primary uppercase tracking-tighter text-center">
            {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg className="w-6 h-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        {/* Mobile: Simple List View, Desktop: Calendar Grid */}
        <div className="hidden md:grid grid-cols-7 gap-2 mb-2">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-center text-[10px] font-black uppercase text-zinc-400 tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {/* Desktop blanks */}
          <div className="contents md:contents">
            {blanks.map(b => <div key={`blank-${b}`} className="hidden md:block p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/30 border border-transparent"></div>)}
          </div>
          
          {days.map(day => {
            const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const dayEvents = currentMonthEvents.filter(e => e.tanggal === dateStr)
            const isToday = day === currentDate.getDate()

            return (
              <div 
                key={day} 
                className={`min-h-[100px] p-3 rounded-2xl border transition-all ${isToday ? 'bg-brand-primary/5 border-brand-primary' : 'bg-white border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800'} ${dayEvents.length > 0 ? 'ring-2 ring-emerald-100 dark:ring-emerald-900/50' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-lg font-black ${isToday ? 'text-brand-primary' : 'text-zinc-700 dark:text-zinc-300'}`}>{day}</span>
                  {dayEvents.length > 0 && <span className="w-2 h-2 rounded-full bg-brand-accent"></span>}
                </div>
                <div className="space-y-1.5">
                  {dayEvents.map(e => (
                    <button 
                      key={e.id}
                      onClick={() => setSelectedEvent(e)}
                      className="w-full text-left p-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[9px] font-bold uppercase tracking-tighter truncate hover:bg-emerald-100 transition-colors"
                    >
                      {e.jam.substring(0, 5)} - {e.nama_event}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal Detail Event */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedEvent(null)}>
          <div className={`bg-white w-full max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 dark:bg-zinc-900 relative flex flex-col ${selectedEvent.poster_url ? 'max-w-4xl md:flex-row md:overflow-hidden' : 'max-w-lg'}`} onClick={e => e.stopPropagation()}>
            
            {/* Absolute Close Button */}
            <button onClick={() => setSelectedEvent(null)} className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center z-20 transition-all ${selectedEvent.poster_url ? 'bg-black/40 text-white hover:bg-black/60 backdrop-blur-md md:bg-zinc-100 md:text-zinc-500 md:hover:bg-zinc-200 dark:md:bg-zinc-800 dark:md:text-zinc-400' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'}`}>✕</button>

            {selectedEvent.poster_url && (
              <div className="w-full md:w-1/2 bg-zinc-950 flex items-center justify-center h-[55vh] min-h-[350px] md:h-auto md:min-h-[600px] relative shrink-0">
                <img src={selectedEvent.poster_url} alt={selectedEvent.nama_event} className="w-full h-full object-contain p-0 md:p-4" />
              </div>
            )}
            
            <div className={`p-6 sm:p-8 md:p-10 flex flex-col ${selectedEvent.poster_url ? 'w-full md:w-1/2 md:overflow-y-auto md:max-h-[90vh]' : 'w-full'}`}>
              <div className="mb-auto">
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent px-3 py-1 bg-amber-50 rounded-full mb-4 inline-block mt-2 md:mt-0">
                  {new Date(selectedEvent.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <h3 className="font-black text-2xl md:text-3xl text-brand-primary uppercase tracking-tighter leading-none mb-3 mt-2">{selectedEvent.nama_event}</h3>
                <p className="text-sm md:text-base font-bold text-zinc-500 flex items-center gap-2 mb-6 md:mb-8">
                  <span className="text-xl">⏰</span> {selectedEvent.jam.substring(0, 5)} WIB
                </p>
                
                <div className="bg-zinc-50 p-5 md:p-6 rounded-3xl dark:bg-zinc-800/50">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">Deskripsi Kegiatan</p>
                  <p className="text-sm md:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {selectedEvent.keterangan || 'Tidak ada deskripsi tambahan.'}
                  </p>
                </div>
              </div>

              <button onClick={() => setSelectedEvent(null)} className="mt-8 w-full py-4 bg-zinc-900 text-white font-black rounded-2xl uppercase tracking-widest active:scale-95 transition-transform text-xs md:hidden">
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}