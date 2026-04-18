import { supabase } from './supabase'
import type { Customizations } from '../context/ChainContext'

export async function loadLive(): Promise<Customizations | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('canvas_snapshots')
      .select('state')
      .eq('is_live', true)
      .maybeSingle()
    if (error || !data) return null
    return data.state as Customizations
  } catch { return null }
}

export async function saveLive(state: Customizations): Promise<void> {
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
