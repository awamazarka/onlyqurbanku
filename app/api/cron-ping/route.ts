import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  // Opsional: Validasi CRON_SECRET dari Vercel untuk keamanan
  // (Memastikan hanya Vercel Cron yang bisa mengakses endpoint ini)
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Melakukan query ringan ke database (hanya mengambil 1 baris)
    // Tujuannya agar database Supabase menerima request dan tidak masuk mode "sleep/pause"
    const { data, error } = await supabase
      .from('qurban_animals')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json(
      { success: true, message: 'Database ping successful', timestamp: new Date().toISOString() },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Cron Ping Error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
