import { supabase } from './supabase'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyState = Record<string, any>

export async function loadLive(): Promise<AnyState | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('canvas_snapshots')
      .select('state')
      .eq('is_live', true)
      .maybeSingle()
    if (error || !data) return null
    return data.state as AnyState
  } catch { return null }
}

export async function saveLive(state: AnyState): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('canvas_snapshots').delete().eq('is_live', true)
    await supabase.from('canvas_snapshots').insert({
      snapshot_name: 'autosave',
      state,
      is_live: true,
    })
  } catch { /* offline — localStorage already saved */ }
}
