import { useEffect, useState } from 'react'

const useSelection = () => {
  const [range, setRange] = useState<Range | null>(null)
  useEffect(() => {
    const onMouseUp = (e: TouchEvent | MouseEvent) => {
      if (e instanceof TouchEvent && e.touches.length > 0) {
        return
      }
      const selection = window.getSelection()
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0)
        setRange(range)
      }
    }
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [setRange])
  return range
}

export default useSelection
