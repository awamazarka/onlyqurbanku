import { getPanitiaProfile } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/DashboardShell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const panitia = await getPanitiaProfile()

  if (!panitia) {
    redirect('/login')
  }

  return (
    <DashboardShell panitia={panitia}>
      {children}
    </DashboardShell>
  )
}
