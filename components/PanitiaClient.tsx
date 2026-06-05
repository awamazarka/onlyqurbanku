'use client'

import { useState, useTransition } from 'react'
import { addPanitiaTask, deletePanitiaTask } from '@/app/dashboard/panitia/actions'

export default function PanitiaClient({ profiles }: { profiles: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [addingTaskId, setAddingTaskId] = useState<string | null>(null)
  const [newTaskName, setNewTaskName] = useState('')

  const handleAddTask = (panitiaId: string) => {
    if (!newTaskName.trim()) return
    startTransition(async () => {
      const res = await addPanitiaTask(panitiaId, newTaskName)
      if (res.success) {
        setAddingTaskId(null)
        setNewTaskName('')
      } else {
        alert(res.error)
      }
    })
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Hapus tugas ini?')) {
      startTransition(() => deletePanitiaTask(taskId))
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {profiles?.map((p) => (
        <div key={p.id} className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-xl font-bold dark:bg-green-900/30">
                {p.nama_lengkap[0]}
              </div>
              <span className="text-[10px] font-black bg-zinc-100 px-2 py-1 rounded-full dark:bg-zinc-800 uppercase tracking-widest text-zinc-500">
                {p.sub_tim}
              </span>
            </div>
            <h3 className="font-black text-lg text-zinc-900 dark:text-white">{p.nama_lengkap}</h3>
            {(() => {
              let phone = p.no_whatsapp || ''
              if (phone && !phone.startsWith('62')) {
                if (phone.startsWith('0')) phone = '62' + phone.substring(1)
                else if (!phone.startsWith('+')) phone = '62' + phone.replace(/\D/g, '')
              }
              phone = phone.replace(/\D/g, '')
              return (
                <a 
                  href={`https://wa.me/${phone}`} 
                  target="_blank"
                  className="text-sm font-bold text-green-600 flex items-center gap-1 mt-1 hover:underline"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049a11.83 11.83 0 001.592 5.952L0 24l6.101-1.594a11.796 11.796 0 005.945 1.6h.005c6.637 0 12.048-5.414 12.051-12.051a11.777 11.777 0 00-3.51-8.513z"/></svg>
                  {p.no_whatsapp}
                </a>
              )
            })()}
          </div>
          
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">📋 Progres Tugas</h4>
              <button 
                onClick={() => setAddingTaskId(addingTaskId === p.id ? null : p.id)}
                className="text-[10px] font-black uppercase text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full hover:bg-brand-primary/20 transition-colors"
              >
                + Tambah
              </button>
            </div>

            {addingTaskId === p.id && (
              <div className="mb-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Nama Tugas Baru..." 
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask(p.id)}
                  className="flex-1 text-xs p-2.5 rounded-xl border-none outline-none focus:ring-2 focus:ring-brand-primary shadow-sm bg-white"
                />
                <button 
                  onClick={() => handleAddTask(p.id)}
                  disabled={isPending || !newTaskName.trim()}
                  className="bg-brand-primary text-white text-xs font-black px-3 rounded-xl uppercase tracking-widest disabled:opacity-50"
                >
                  OK
                </button>
              </div>
            )}

            {p.panitia_tasks?.length === 0 ? (
              <p className="text-xs text-zinc-400 italic">Belum ada tugas diberikan.</p>
            ) : (
              <div className="space-y-3">
                {p.panitia_tasks.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between group">
                    <p className={`text-xs font-bold ${task.status_tugas === 'Selesai' ? 'text-zinc-400 line-through decoration-zinc-300' : 'text-zinc-700 dark:text-zinc-300'}`}>{task.task_name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${task.status_tugas === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {task.status_tugas.toUpperCase()}
                      </span>
                      <button onClick={() => handleDeleteTask(task.id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 p-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}