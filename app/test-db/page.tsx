import { createClient } from '@/utils/supabase/server'

export default async function TestDBPage() {
  const supabase = await createClient()
  
  const { data, error } = await supabase.from('panitia_profile').select('*').limit(1)

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error.message}</p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p>Success! Connection established.</p>
          <pre className="mt-2">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
