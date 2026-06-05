'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addEvent(formData: FormData) {
  const supabase = await createClient()
  
  const nama_event = formData.get('nama_event') as string
  const tanggal = formData.get('tanggal') as string
  const jam = formData.get('jam') as string
  const keterangan = formData.get('keterangan') as string
  const is_rutin = formData.get('is_rutin') === 'true'
  const file = formData.get('poster') as File | null

  let poster_url = null

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `event-${Date.now()}.${fileExt}`
    const filePath = `posters/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('event_posters')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      return { error: `Upload gagal: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('event_posters')
      .getPublicUrl(filePath)
      
    poster_url = publicUrl
  }

  const { error } = await supabase
    .from('mushala_events')
    .insert([{ nama_event, tanggal, jam, keterangan, poster_url, is_rutin }])

  if (error) return { error: error.message }
  
  revalidatePath('/events')
  revalidatePath('/dashboard/events')
  return { success: true }
}

export async function updateEvent(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const nama_event = formData.get('nama_event') as string
  const tanggal = formData.get('tanggal') as string
  const jam = formData.get('jam') as string
  const keterangan = formData.get('keterangan') as string
  const is_rutin = formData.get('is_rutin') === 'true'
  const file = formData.get('poster') as File | null

  const updateData: any = { nama_event, tanggal, jam, keterangan, is_rutin }

  if (file && file.size > 0) {
    const fileExt = file.name.split('.').pop()
    const fileName = `event-${Date.now()}.${fileExt}`
    const filePath = `posters/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('event_posters')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      return { error: `Upload gagal: ${uploadError.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('event_posters')
      .getPublicUrl(filePath)
      
    updateData.poster_url = publicUrl
  }

  const { error } = await supabase
    .from('mushala_events')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/events')
  revalidatePath('/dashboard/events')
  return { success: true }
}

export async function deleteEvent(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('mushala_events').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/events')
  revalidatePath('/dashboard/events')
}
