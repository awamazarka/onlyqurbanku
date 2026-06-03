'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginWithToken(formData: FormData) {
  const token = formData.get('token') as string
  await verifyAndSetSession(token)
}

export async function verifyAndSetSession(token: string) {
  console.log('Verifying token:', token)
  if (!token) return { error: 'Token diperlukan' }

  const supabase = await createClient()
  
  // Check if token exists in panitia_profile
  const { data: panitia, error } = await supabase
    .from('panitia_profile')
    .select('id, nama_lengkap, role')
    .eq('access_token', token)
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return { error: 'Token tidak valid' }
  }
  
  if (!panitia) {
    console.log('No panitia found for token')
    return { error: 'Token tidak valid' }
  }

  console.log('Login success for:', panitia.nama_lengkap)

  // Set the token in a cookie
  const cookieStore = await cookies()
  cookieStore.set('qurban_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })

  redirect('/dashboard')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('qurban_token')
  redirect('/login')
}
