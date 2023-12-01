import { DEV } from './env'

const injectJS = (path: string) => {
  const script = document.createElement('script')
  script.src = chrome.extension.getURL(path)
  document.head.appendChild(script)
}
const injectCSS = (path: string) => {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = chrome.extension.getURL(path)
  document.head.appendChild(link)
}

const active = localStorage.getItem('__SOPHIA__ACTIVE__')

// @ts-ignore
window.__SOPHIA__ ??= {}

if (!window.__SOPHIA__.INJECTED) {
  window.__SOPHIA__.INJECTED = true
  if (DEV) {
    injectJS('dist/inject.js')
    injectCSS('dist/inject.css')
  } else {
    injectJS('inject.js')
    // injectCSS('inject.css')
  }
}
