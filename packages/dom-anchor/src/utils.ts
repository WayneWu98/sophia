// @ts-ignore
import DiffMatchPatch from 'diff-match-patch'

const dmp = new DiffMatchPatch()
export const diff = (s1: string, s2: string) => dmp.diff_main(s1, s2)
export const diffDistance = (s1: string, s2: string) => {
  return dmp.diff_levenshtein(diff(s1, s2)) / (Math.max(s1.length, s2.length) || 1)
}
const reversedCache = new Map<string, string>()

export const fuzzySearch = (text: string, query: string, length = 1000): [number, number] => {
  dmp.Match_Distance = length
  const start = dmp.match_main(text, query, 0)
  const reversedText = reversedCache.get(text) ?? [...text].reverse().join('')
  const reversedQuery = reversedCache.get(query) ?? [...query].reverse().join('')
  reversedCache.set(text, reversedText)
  reversedCache.set(query, reversedQuery)
  const end = text.length - dmp.match_main(reversedText, reversedQuery, 0)
  return [start, end]
}

export const getPath = (element: Element, root = 'html') => {
  let selector = ''
  let foundRoot
  let currentElement = element

  do {
    const tagName = currentElement.tagName.toLowerCase()
    const parentElement = currentElement.parentElement!

    if (parentElement.childElementCount > 1) {
      const parentsChildren = [...parentElement.children]
      const tag: Element[] = []
      parentsChildren.forEach(child => {
        if (child.tagName.toLowerCase() === tagName) tag.push(child) // Append to tag
      })

      if (tag.length === 1) {
        selector = `/${tagName}${selector}`
      } else {
        const position = tag.indexOf(currentElement) + 1
        selector = `/${tagName}[${position}]${selector}`
      }
    } else {
      selector = `/${tagName}${selector}`
    }

    currentElement = parentElement
    foundRoot = parentElement.tagName.toLowerCase() === root
    if (foundRoot) selector = `/${root}${selector}`
  } while (foundRoot === false)
  return selector
}

export const getRangeSelector = (range: Range): RangeSelector => {
  const startNode = range.startContainer
  const endNode = range.endContainer
  let startContainer = getPath(range.startContainer.parentElement!)
  let endContainer = getPath(range.endContainer.parentElement!)
  if (startNode.nodeType === Node.TEXT_NODE) {
    // @ts-ignore
    const index = [...startNode.parentElement!.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).indexOf(startNode)
    startContainer += `/text()[${index + 1}]`
  }
  if (endNode.nodeType === Node.TEXT_NODE) {
    // @ts-ignore
    const index = [...endNode.parentElement!.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).indexOf(endNode)
    endContainer += `/text()[${index + 1}]`
  }
  return {
    endContainer,
    endOffset: range.endOffset,
    startContainer,
    startOffset: range.startOffset,
    type: 'RangeSelector',
  }
}

export const findTextNodes = (node: Node | Node[], excluded?: Set<string>) => {
  if (!Array.isArray(node)) {
    node = [node]
  }
  const nodes: Text[] = []
  for (const n of node) {
    if (n.nodeType === Node.TEXT_NODE && !excluded?.has(n.nodeName)) {
      // @ts-ignore
      nodes.push(n)
    }
    for (const child of n.childNodes) {
      nodes.push(...findTextNodes(child, excluded))
    }
  }
  return nodes
}

export const flatNodes = (node: Node | Node[]) => {
  if (!Array.isArray(node)) {
    node = [node]
  }
  const nodes: Node[] = []
  for (const n of node) {
    nodes.push(n)
    for (const child of n.childNodes) {
      nodes.push(...flatNodes(child))
    }
  }
  return nodes
}

export const escapeRegExp = (string: string, mode = '') => {
  return new RegExp(string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), mode)
}

export const devLog = (...args: any[]) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}
