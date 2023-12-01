import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'uno.css'

const el = document.createElement('div')
document.body.appendChild(el)
const app = ReactDOM.createRoot(el)

const activate = () => {
  app.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
const deactivate = () => app.unmount()
activate()

// window.__SOPHIA__.activate = activate
// window.__SOPHIA__.deactivate = deactivate
