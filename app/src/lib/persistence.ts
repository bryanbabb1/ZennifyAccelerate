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

export interface SnapshotMeta {
  id: string
  snapshot_name: string
  created_at: string
}

export async function saveSnapshot(name: string, state: AnyState): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('canvas_snapshots').insert({ snapshot_name: name, state, is_live: false })
  } catch { /* offline */ }
}

export async function listSnapshots(): Promise<SnapshotMeta[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase
      .from('canvas_snapshots')
      .select('id, snapshot_name, created_at')
      .eq('is_live', false)
      .order('created_at', { ascending: false })
    if (error || !data) return []
    return data as SnapshotMeta[]
  } catch { return [] }
}

export async function loadSnapshot(id: string): Promise<AnyState | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from('canvas_snapshots')
      .select('state')
      .eq('id', id)
      .maybeSingle()
    if (error || !data) return null
    return data.state as AnyState
  } catch { return null }
}

export async function deleteSnapshot(id: string): Promise<void> {
  if (!supabase) return
  try {
    await supabase.from('canvas_snapshots').delete().eq('id', id)
  } catch { /* offline */ }
}
