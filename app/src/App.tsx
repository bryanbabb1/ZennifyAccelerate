import { ChainProvider } from './context/ChainContext'
import ValueChain from './components/ValueChain'

export default function App() {
  return (
    <ChainProvider>
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <ValueChain />
      </div>
    </ChainProvider>
  )
}
