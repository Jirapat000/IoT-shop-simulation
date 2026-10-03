import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL     = 'https://kjbfhfinbbygcnqjhnnl.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYmZoZmluYmJ5Z2NucWpobm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NDI4MzMsImV4cCI6MjEwNjUxODgzM30.' +
  'XJO4KmWXHdjK1euy3tl4soOzS6LI67ZArgj6Ll1g5Po'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export type IoT888Row = {
  id: number
  user_id: string
  email: string
  username: string
  created_at: string
  last_login: string | null
}

/** Upsert user profile into IoT888 table */
export async function upsertIoT888(user: {
  id: string
  email: string
  username?: string
}) {
  return supabase.from('IoT888').upsert(
    {
      user_id   : user.id,
      email     : user.email,
      username  : user.username ?? user.email.split('@')[0],
      last_login: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
}
