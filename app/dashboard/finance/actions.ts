'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePayment(id: string, amount: number, status: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('pekurban_names')
    .update({ 
      amount_paid: amount,
      payment_status: status 
    })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/dashboard/finance')
}

export async function addCashflow(formData: FormData, picId: string) {
  const supabase = await createClient()
  
  const tipe = formData.get('tipe') as string
  const kategori = formData.get('kategori') as string
  const nominal = parseFloat(formData.get('nominal') as string)
  const keterangan = formData.get('keterangan') as string

  const { error } = await supabase
    .from('operational_cashflow')
    .insert([{ 
      tipe, 
      kategori, 
      nominal, 
      keterangan, 
      pic_id: picId 
    }])

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/finance')
  return { success: true }
}

export async function upsertPekurban(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string 
  const animal_id = formData.get('animal_id') as string
  const nama_pekurban = formData.get('nama_pekurban') as string
  const no_whatsapp = formData.get('no_whatsapp') as string
  const asal_rt_rw = formData.get('asal_rt_rw') as string
  const slot_number = parseInt(formData.get('slot_number') as string)
  const amount_paid = parseFloat(formData.get('amount_paid') as string || '0')
  const biaya_potong_dibayar = formData.get('biaya_potong_dibayar') === 'true'

  // Fetch animal price to verify auto-lunas status
  const { data: animal } = await supabase
    .from('qurban_animals')
    .select('harga_per_slot')
    .eq('id', animal_id)
    .single()

  let payment_status = 'Belum Bayar'
  if (animal && amount_paid >= animal.harga_per_slot && biaya_potong_dibayar) {
    payment_status = 'Lunas'
  } else if (amount_paid > 0) {
    payment_status = 'Cicil'
  }

  const data = {
    animal_id,
    nama_pekurban,
    no_whatsapp,
    asal_rt_rw,
    slot_number,
    amount_paid,
    biaya_potong_dibayar,
    payment_status,
  }

  let error
  if (id) {
    const { error: updateError } = await supabase
      .from('pekurban_names')
      .update(data)
      .eq('id', id)
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from('pekurban_names')
      .insert([data])
    error = insertError
  }

  if (error) return { error: error.message }
  
  revalidatePath('/')
  revalidatePath('/dashboard/finance')
  return { success: true }
}

export async function deletePekurban(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('pekurban_names').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/')
  revalidatePath('/dashboard/finance')
}
