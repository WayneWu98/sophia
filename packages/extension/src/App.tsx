import { useState } from 'react'
import './App.css'
import useSelection from './hooks/useSelection'
import Notation from './components/Notation'

function App() {
  const [count, setCount] = useState(0)
  const range = useSelection()
  const bcr = range?.getBoundingClientRect()
  const position = bcr ? ([bcr.left + bcr.width / 2, bcr.top] as [number, number]) : void 0
  return (
    <>
      <h4>
        Vite <span>++</span> React
      </h4>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the 1Vite and React logos to learn more</p>
      <Notation position={position} />
    </>
  )
}

export default App
