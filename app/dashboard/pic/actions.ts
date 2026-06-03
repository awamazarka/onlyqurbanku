'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAnimalStatus(id: string, status: string, photo_url?: string) {
  const supabase = await createClient()
  
  const updateData: any = { status_hewan: status }
  if (photo_url) updateData.photo_url = photo_url

  const { error } = await supabase
    .from('qurban_animals')
    .update(updateData)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/dashboard/pic')
}

export async function addAnimal(formData: FormData) {
  const supabase = await createClient()
  
  const tag_number = formData.get('tag_number') as string
  const jenis_hewan = formData.get('jenis_hewan') as string
  const tipe_jenis = formData.get('tipe_jenis') as string

  const { error } = await supabase
    .from('qurban_animals')
    .insert([{ tag_number, jenis_hewan, tipe_jenis }])

  if (error) return { error: error.message }
  
  revalidatePath('/')
  revalidatePath('/dashboard/pic')
  return { success: true }
}

export async function uploadAnimalPhoto(id: string, formData: FormData, shouldFinish: boolean = false) {
  console.log('Starting upload for animal:', id)
  const supabase = await createClient()
  const file = formData.get('photo') as File
  if (!file) throw new Error('No file provided')

  const fileExt = file.name.split('.').pop()
  const fileName = `${id}-${Date.now()}.${fileExt}`
  const filePath = `animal-photos/${fileName}`

  console.log('Uploading to path:', filePath)

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('qurban_photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`Upload storage gagal: ${uploadError.message}`)
  }

  const { data: { publicUrl } } = supabase.storage
    .from('qurban_photos')
    .getPublicUrl(filePath)

  if (shouldFinish) {
    await updateAnimalStatus(id, 'Selesai Sembelih', publicUrl)
  } else {
    // Just update the photo_url without changing status
    const { error } = await supabase
      .from('qurban_animals')
      .update({ photo_url: publicUrl })
      .eq('id', id)
    
    if (error) throw new Error(error.message)
    revalidatePath('/')
    revalidatePath('/dashboard/pic')
  }
}

export async function updateTaskStatus(taskId: string, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('panitia_tasks')
    .update({ status_tugas: status, updated_at: new Date().toISOString() })
    .eq('id', taskId)

  if (error) throw new Error(error.message)
  
  revalidatePath('/dashboard/pic')
  revalidatePath('/dashboard/panitia')
}

export async function updateAnimalPrice(id: string, price: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('qurban_animals')
    .update({ harga_per_slot: price })
    .eq('id', id)

  if (error) throw new Error(error.message)
  
  revalidatePath('/')
  revalidatePath('/dashboard/pic')
  revalidatePath('/dashboard/finance')
}
