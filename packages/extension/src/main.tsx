// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './dev/App.tsx'
import './dev/index.css'
import DomAnchor from './dom-anchor.ts'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

const records: Selector[][] = (window.records = [])

setTimeout(() => {
  const anchor = (window.anchor = new DomAnchor(document.body))
  const s = JSON.parse(
    '[{"endContainer":"/html/body/div/div/p/text()[2]","endOffset":7,"startContainer":"/html/body/div/h4/text()[2]","startOffset":3,"type":"RangeSelector"},{"end":41,"start":15,"type":"TextPositionSelector"},{"exact":"actEdit src/App.tsx and sa","prefix":"  Vite ++ Re","suffix":"ve to test H","type":"TextQuoteSelector"}]'
  )
  console.log('generated')
  console.log('matched: ', anchor.match(s)?.toString())
}, 1000)
