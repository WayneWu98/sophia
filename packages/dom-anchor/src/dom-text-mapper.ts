import { flatNodes, fuzzySearch } from './utils'

const EXCLUDED_NODE = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'CANVAS', 'SVG', 'HEAD'])

export default class DomTextMapper {
  private excluded: Set<string> = new Set(EXCLUDED_NODE)
  private nodes: Node[] = []
  private _text: string = ''
  constructor(private root: HTMLElement) {}
  get text() {
    if (this._text.length > 0) {
      return this._text
    }
    return (this._text = this.nodes.reduce((prev, curr) => {
      if (this.excluded.has(curr.nodeName) || curr.nodeType !== Node.TEXT_NODE) {
        return prev
      }
      return prev + curr.textContent
    }, ''))
  }
  get length() {
    return this.text.length
  }
  generate() {
    this._text = ''
    this.nodes = flatNodes(this.root)
  }
  matchByOffset(offset: number): MatchingResult | undefined {
    if (offset < 0 || offset > this.text.length) {
      return
    }
    let currentOffset = -1
    let lastTextNode: Text | undefined
    for (const node of this.nodes) {
      if (node.nodeType !== Node.TEXT_NODE) {
        continue
      }
      if (currentOffset >= offset) {
        if (lastTextNode) {
          return {
            node: lastTextNode,
            offset: offset - currentOffset + lastTextNode.textContent!.length - 1,
          }
        }
        return
      }
      lastTextNode = node as Text
      currentOffset += node.textContent?.length ?? 0
    }
    if (currentOffset >= offset) {
      if (lastTextNode) {
        return {
          node: lastTextNode,
          offset: offset - currentOffset + lastTextNode.textContent!.length - 1,
        }
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
  getTextNodePosition(node: Text) {
    let currentOffset = 0
    for (const n of this.nodes) {
      if (n.nodeType !== Node.TEXT_NODE) {
        continue
      }
      if (n === node) {
        return currentOffset
      }
      currentOffset += n.textContent?.length ?? 0
    }
  }
  getTextNodePositionAfter(node: Node) {
    let currentOffset = 0
    for (const n of this.nodes) {
      if (n === node) {
        return currentOffset + 1
      }
      if (n.nodeType === Node.TEXT_NODE) {
        currentOffset += n.textContent?.length ?? 0
      }
    }
  }
  getTextNodePositionBefore(node: Node) {
    let currentOffset = 0
    for (const n of this.nodes) {
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
}
