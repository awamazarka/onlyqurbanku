'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { verifyAndSetSession, loginWithToken } from './actions'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get('token')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (tokenFromUrl) {
      startTransition(async () => {
        const result = await verifyAndSetSession(tokenFromUrl)
        if (result?.error) {
          setError(result.error)
        }
      })
    }
  }, [tokenFromUrl])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await loginWithToken(formData)
      if (result && 'error' in result) {
        setError(result.error as string)
      }
    })
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Islamic Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-primary/5 rounded-full -ml-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full -mr-32 -mb-32 blur-3xl"></div>

      <div className="max-w-md w-full bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(6,78,59,0.1)] border border-zinc-50 relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
             <span className="text-4xl">🔑</span>
          </div>
          <h1 className="text-3xl font-black text-brand-primary uppercase tracking-tighter leading-none">Khidmah Panitia</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Masuk ke sistem manajemen amanah</p>
        </div>
        
        {tokenFromUrl && isPending ? (
          <div className="text-center py-10">
             <div className="animate-spin text-4xl mb-4">🌙</div>
             <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Memverifikasi Amanah...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="token" className="block text-[10px] font-black uppercase text-zinc-400 ml-1 tracking-widest">
                Unique Token WhatsApp
              </label>
              <input
                type="text"
                name="token"
                id="token"
                required
                placeholder="Ketik kode unik Anda..."
                className="w-full px-6 py-5 bg-zinc-50 border-none rounded-[1.5rem] font-black text-brand-primary placeholder-zinc-300 outline-none focus:ring-4 focus:ring-brand-primary/10 transition-all text-center tracking-widest"
              />
            </div>

            {error && (
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-center gap-3 animate-in shake-in duration-500">
                <span className="text-xl">⚠️</span>
                <p className="text-xs font-black text-amber-700 uppercase leading-tight">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-brand-primary text-white font-black py-5 rounded-[1.5rem] shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-sm"
            >
              {isPending ? 'MEMPROSES...' : 'MASUK SEKARANG'}
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-zinc-50 text-center">
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.1em] leading-relaxed">
            Hubungi Ketua Panitia jika Anda belum menerima kode akses unik.
          </p>
        </div>
      </div>
    </div>
  )
}
