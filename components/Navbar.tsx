import { getPanitiaProfile } from '@/utils/supabase/server'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const panitia = await getPanitiaProfile()

  return <NavbarClient panitia={panitia} />
}
