import { fuzzySearch } from './utils'

const EXCLUDED_NODE = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'CANVAS', 'SVG', 'HEAD'])

export default class DomTextMapper {
  private excluded: Set<string>
  private _flattedNodes: Node[]
  private _text: string = ''
  constructor(private root: HTMLElement) {
    this.excluded = new Set(EXCLUDED_NODE)
    this.reset()
  }
  get flattedNodes() {
    if (this._flattedNodes.length > 0) {
      return this._flattedNodes
    }
    this._flattedNodes = []
    this.traverse(({ node }) => {
      if (this.excluded.has(node.nodeName)) {
        return
      }
      this._flattedNodes.push(node)
    })
    return this._flattedNodes
  }
  get text() {
    if (this._text.length > 0) {
      return this._text
    }
    this.traverse(({ node }) => {
      if (this.excluded.has(node.nodeName) || node.nodeType !== Node.TEXT_NODE) {
        return
      }
      this._text += node.textContent ?? ''
    })
    return this._text
  }
  get length() {
    return this.text.length
  }
  reset() {
    this._text = ''
    this._flattedNodes = []
  }
  matchByOffset(offset: number): MatchingResult | undefined {
    if (offset < 0 || offset > this.text.length) {
      return
    }
    let currentOffset = -1
    let lastTextNode: Text | undefined
    this.traverse(({ node, stop }) => {
      if (node.nodeType !== Node.TEXT_NODE || this.excluded.has(node.nodeName)) {
        return
      }
      if (currentOffset >= offset) {
        return stop()
      }
      lastTextNode = node as Text
      currentOffset += node.textContent?.length ?? 0
    })
    if (currentOffset >= offset && lastTextNode) {
      return {
        node: lastTextNode,
        offset: offset - currentOffset + lastTextNode.textContent!.length - 1,
      }
    }
  }
  matchByText(text: string): [MatchingResult, MatchingResult] | undefined {
    const startIndex = this.text.indexOf(text)
    const endIndex = startIndex + text.length - 1
    const start = this.matchByOffset(startIndex)
    const end = this.matchByOffset(endIndex)
    if (!start || !end) return
    return [start, end]
  }
  matchAllByText(text: string): [MatchingResult, MatchingResult][] {
    const results: [MatchingResult, MatchingResult][] = []
    for (const { index } of [...this.text.matchAll(new RegExp(text, 'gi'))]) {
      if (!index) continue
      const start = this.matchByOffset(index)
      const end = this.matchByOffset(index + text.length - 1)
      if (!start || !end) continue
      results.push([start, end])
    }
    return results
  }
  fuzzyMatchByText(text: string) {
    const [start, end] = fuzzySearch(this.text, text, this.length * 3).map(v => this.matchByOffset(v))
    if (!start || !end) return
    return [start, end]
  }
  getTextPosition(node: Text) {
    let currentOffset = 0
    for (const n of this.flattedNodes) {
      if (n.nodeType !== Node.TEXT_NODE) {
        continue
      }
      if (n === node) {
        return currentOffset
      }
      currentOffset += n.textContent?.length ?? 0
    }
  }
  getTextPositionAfter(node: Node) {
    let currentOffset = 0
    for (const n of this.flattedNodes) {
      if (n === node) {
        return currentOffset + 1
      }
      if (n.nodeType === Node.TEXT_NODE) {
        currentOffset += n.textContent?.length ?? 0
      }
    }
  }
  getTextPositionBefore(node: Node) {
    let currentOffset = 0
    for (const n of this.flattedNodes) {
      if (n === node) {
        return currentOffset
      }
      if (n.nodeType === Node.TEXT_NODE) {
        currentOffset += n.textContent?.length ?? 0
      }
    }
  }
  exclude(node: string | string[]) {
    if (typeof node === 'string') {
      node = [node]
    }
    node.forEach(n => this.excluded.add(n))
  }
  include(node: string | string[]) {
    if (typeof node === 'string') {
      node = [node]
    }
    node.forEach(n => this.excluded.delete(n))
  }
  traverse(cb: (prams: { node: Node; index: number; depth: number; stop: () => void }) => void) {
    let index = 0
    let stopped = false
    const stop = () => {
      stopped = true
    }
    const _traverse = (node: Node, depth = 0) => {
      if (stopped) return
      cb({ node, index: index++, depth, stop })
      if (node.childNodes.length > 0) {
        for (const n of node.childNodes) {
          _traverse(n, depth + 1)
        }
      }
    }
    _traverse(this.root)
  }
}
