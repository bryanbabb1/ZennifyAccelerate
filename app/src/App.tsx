import EcosystemOverview from './components/EcosystemOverview'

// NOTE: ValueChain and SkillsLibrary components are intentionally kept in the
// codebase (src/components/ValueChain.tsx, SkillsLibrary.tsx) as a backup of the
// previous "AI Value Chain" plan, but are no longer rendered. To restore them,
// reintroduce a tab switcher here.

export default function App() {
  return <EcosystemOverview />
}
