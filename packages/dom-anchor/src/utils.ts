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
  // Selector
  let selector = ''
  // Loop handler
  let foundRoot
  // Element handler
  let currentElement = element

  // Do action until we reach html element
  do {
    // Get element tag name
    const tagName = currentElement.tagName.toLowerCase()
    // Get parent element
    const parentElement = currentElement.parentElement!

    // Count children
    if (parentElement.childElementCount > 1) {
      // Get children of parent element
      const parentsChildren = [...parentElement.children]
      // Count current tag
      const tag: Element[] = []
      parentsChildren.forEach(child => {
        if (child.tagName.toLowerCase() === tagName) tag.push(child) // Append to tag
      })

      // Is only of type
      if (tag.length === 1) {
        // Append tag to selector
        selector = `/${tagName}${selector}`
      } else {
        // Get position of current element in tag
        const position = tag.indexOf(currentElement) + 1
        // Append tag to selector
        selector = `/${tagName}[${position}]${selector}`
      }
    } else {
      //* Current element has no siblings
      // Append tag to selector
      selector = `/${tagName}${selector}`
    }

    // Set parent element to current element
    currentElement = parentElement
    // Is root
    foundRoot = parentElement.tagName.toLowerCase() === root
    // Finish selector if found root element
    if (foundRoot) selector = `/${root}${selector}`
  } while (foundRoot === false)

  // Return selector
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
