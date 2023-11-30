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
    '[{"endContainer":"/html/body/div/h1[2]/text()[2]","endOffset":2,"startContainer":"/html/body/div/h1[2]/text()[1]","startOffset":0,"type":"RangeSelector"},{"end":24,"start":16,"type":"TextPositionSelector"},{"exact":"Vite + R","prefix":"Vite  React","suffix":"cosu234234nt is","type":"TextQuoteSelector"}]'
  )
  console.log('generated')
  console.log('matched: ', anchor.match(s)?.toString())
}, 1000)
