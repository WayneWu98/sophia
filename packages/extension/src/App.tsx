import { useState } from 'react'
import './App.css'
import useSelection from './hooks/useSelection'
import Notation from './components/Notation'

function App() {
  const [count, setCount] = useState(0)
  const range = useSelection()
  console.log('range', range)
  const bcr = range?.collapsed ? void 0 : range?.getBoundingClientRect()
  const position = bcr ? ([bcr.left + bcr.width / 2, bcr.bottom] as [number, number]) : void 0
  return (
    <>
      <Notation position={position} />
    </>
  )
}

export default App
