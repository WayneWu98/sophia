declare global {
  interface Window {
    __SOPHIA__: {
      INJECTED: boolean
      activate: () => void
      deactivate: () => void
    }
  }
}

export {}
