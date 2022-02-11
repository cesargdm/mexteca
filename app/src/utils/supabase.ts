import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGJla2hvbnN1aGFwdG14Y2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ0MjgzMzcsImV4cCI6MTk2MDAwNDMzN30.8ZNeKaJZsPvHs9UFYPT4AM2CB4LHyZIHh5pSPuuvXks'
const SUPABASE_PROJECT = 'https://yzhbekhonsuhaptmxckk.supabase.co'

export const client = createClient(SUPABASE_PROJECT, SUPABASE_ANON_KEY, {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false,
})
