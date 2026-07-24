import EcosystemOverview from './components/EcosystemOverview'
import PasswordGate from './components/PasswordGate'

// NOTE: ValueChain and SkillsLibrary components are intentionally kept in the
// codebase (src/components/ValueChain.tsx, SkillsLibrary.tsx) as a backup of the
// previous "AI Value Chain" plan, but are no longer rendered. To restore them,
// reintroduce a tab switcher here.
//
// PasswordGate is a TEMPORARY soft gate until launch. Remove it (render
// <EcosystemOverview /> directly) to make the site public.

export default function App() {
  return (
    <PasswordGate>
      <EcosystemOverview />
    </PasswordGate>
  )
}
