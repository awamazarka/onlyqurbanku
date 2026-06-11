'use client'

interface Profile {
  nama_lengkap: string
  sub_tim: string
  role: string
}

export default function StructureTreeClient({ profiles }: { profiles: Profile[] }) {
  // Hierarchical Data Structure
  // Ketua (Super Admin) -> Sub Tim (Logistik, Jagal, Distribusi, Bendahara) -> Anggota

  const ketua = profiles.find(p => p.role === 'admin')
  const bendahara = profiles.filter(p => p.sub_tim === 'Bendahara' && p.role !== 'admin')
  const logistik = profiles.filter(p => p.sub_tim === 'Logistik' && p.role !== 'admin')
  const jagal = profiles.filter(p => p.sub_tim === 'Jagal' && p.role !== 'admin')
  const distribusi = profiles.filter(p => p.sub_tim === 'Distribusi' && p.role !== 'admin')

  const TeamBox = ({ title, members, colorClass }: { title: string, members: Profile[], colorClass: string }) => (
    <div className="flex flex-col items-center">
      <div className={`px-6 py-3 rounded-2xl ${colorClass} text-white font-black text-[10px] uppercase tracking-widest shadow-lg mb-4 text-center min-w-[160px]`}>
        {title}
      </div>
      <div className="flex flex-col gap-2">
        {members.length > 0 ? members.map((m, i) => (
          <div key={i} className="px-4 py-2 bg-white border border-zinc-100 rounded-xl shadow-sm text-center">
            <p className="text-[11px] font-black text-brand-primary uppercase">{m.nama_lengkap}</p>
          </div>
        )) : (
          <p className="text-[8px] font-bold text-zinc-300 italic uppercase">Belum ada personel</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 pb-32 overflow-x-auto">
      <header className="text-center mb-20">
        <div className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary text-[10px] font-black rounded-full uppercase tracking-[0.2em] mb-4">
          Struktur Organisasi
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-brand-primary tracking-tighter uppercase leading-none">
          Kepanitiaan <span className="text-brand-accent italic">Qurban</span>
        </h1>
        <p className="text-zinc-500 font-medium max-w-xl mx-auto italic mt-4 text-sm px-4">
          "Saling tolong menolonglah kamu dalam mengerjakan kebajikan dan takwa."
        </p>
      </header>

      <div className="min-w-[800px] flex flex-col items-center gap-16 relative">
        {/* Connection Lines (Conceptual SVG or CSS) */}
        
        {/* Top Level: Ketua */}
        <div className="relative">
          <div className="px-10 py-5 bg-brand-primary rounded-3xl text-white shadow-2xl shadow-emerald-900/40 text-center relative z-10">
            <p className="text-[8px] font-black text-emerald-200 uppercase tracking-widest mb-1">Ketua Panitia</p>
            <h2 className="text-xl font-black uppercase tracking-tight">{ketua?.nama_lengkap || 'Belum Ditentukan'}</h2>
          </div>
          {/* Vertical line down */}
          <div className="absolute left-1/2 -bottom-16 w-[2px] h-16 bg-gradient-to-b from-brand-primary to-zinc-200 -translate-x-1/2"></div>
        </div>

        {/* Level 2: Sub-Teams Grid */}
        <div className="relative pt-10">
          {/* Horizontal line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-zinc-200"></div>
          
          <div className="grid grid-cols-4 gap-12 relative">
            {/* T-junction lines for each team */}
            <div className="absolute -top-10 left-[12.5%] w-[2px] h-10 bg-zinc-200"></div>
            <div className="absolute -top-10 left-[37.5%] w-[2px] h-10 bg-zinc-200"></div>
            <div className="absolute -top-10 left-[62.5%] w-[2px] h-10 bg-zinc-200"></div>
            <div className="absolute -top-10 left-[87.5%] w-[2px] h-10 bg-zinc-200"></div>

            <TeamBox title="Bendahara" members={bendahara} colorClass="bg-amber-500" />
            <TeamBox title="Logistik & Hewan" members={logistik} colorClass="bg-blue-500" />
            <TeamBox title="Jagal & Kuliti" members={jagal} colorClass="bg-rose-500" />
            <TeamBox title="Distribusi" members={distribusi} colorClass="bg-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  )
}
