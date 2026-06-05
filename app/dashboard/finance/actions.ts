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

export async function updateCashflow(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const tipe = formData.get('tipe') as string
  const kategori = formData.get('kategori') as string
  const nominal = parseFloat(formData.get('nominal') as string)
  const keterangan = formData.get('keterangan') as string

  const { error } = await supabase
    .from('operational_cashflow')
    .update({ 
      tipe, 
      kategori, 
      nominal, 
      keterangan 
    })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/dashboard/finance')
  return { success: true }
}

export async function deleteCashflow(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('operational_cashflow').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/dashboard/finance')
}

export async function addInstallment(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get('id') as string
  const date = formData.get('date') as string
  const addedAmount = parseFloat(formData.get('amount') as string)
  
  // Get current data
  const { data: pekurban, error: fetchError } = await supabase
    .from('pekurban_names')
    .select('amount_paid, notes, animal_id, biaya_potong_dibayar, qurban_animals(harga_per_slot)')
    .eq('id', id)
    .single()
    
  if (fetchError || !pekurban) return { error: fetchError?.message || 'Data tidak ditemukan' }
  
  const currentAmount = pekurban.amount_paid || 0
  const newAmount = currentAmount + addedAmount
  
  // Parse existing history
  let history = []
  if (pekurban.notes) {
    try {
      history = JSON.parse(pekurban.notes)
      if (!Array.isArray(history)) history = []
    } catch (e) {
      history = []
    }
  }
  
  // Append new installment
  history.push({
    id: Date.now().toString(),
    date: date,
    amount: addedAmount
  })
  
  // Check Lunas status
  const qAnimals: any = pekurban.qurban_animals
  const hargaSlot = Array.isArray(qAnimals) ? qAnimals[0]?.harga_per_slot : qAnimals?.harga_per_slot || 0
  let payment_status = 'Cicil'
  if (newAmount >= hargaSlot && pekurban.biaya_potong_dibayar) {
    payment_status = 'Lunas'
  }
  
  const { error: updateError } = await supabase
    .from('pekurban_names')
    .update({
      amount_paid: newAmount,
      notes: JSON.stringify(history),
      payment_status: payment_status
    })
    .eq('id', id)
    
  if (updateError) return { error: updateError.message }
  
  revalidatePath('/')
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

  const data: any = {
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
    // If editing existing, we do not overwrite notes to preserve history, unless we want to reset it.
    // For MVP, editing from Manage tab just updates the total amount.
    const { error: updateError } = await supabase
      .from('pekurban_names')
      .update(data)
      .eq('id', id)
    error = updateError
  } else {
    // If new registration, initialize history
    let notes = null
    if (amount_paid > 0) {
      const initialHistory = [{
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        amount: amount_paid
      }]
      notes = JSON.stringify(initialHistory)
    }
    data.notes = notes

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
