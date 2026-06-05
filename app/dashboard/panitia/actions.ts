'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addPanitiaTask(panitiaId: string, taskName: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('panitia_tasks')
    .insert([{ 
      pic_id: panitiaId, 
      task_name: taskName,
      status_tugas: 'Belum Mulai'
    }])

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/panitia')
  revalidatePath('/dashboard/pic')
  return { success: true }
}

export async function deletePanitiaTask(taskId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('panitia_tasks').delete().eq('id', taskId)
  
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/panitia')
  revalidatePath('/dashboard/pic')
}
