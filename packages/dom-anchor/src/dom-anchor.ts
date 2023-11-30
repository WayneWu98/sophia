import DomTextMapper from './dom-text-mapper'
import { getPath, diffDistance } from './utils'

export default class DomAnchor {
  domTextMapper: DomTextMapper
  diffingTolerance = 0.4
  get root() {
    return document.body
  }
  constructor() {
    this.domTextMapper = new DomTextMapper(this.root)
    this.domTextMapper.generate()
  }
  match(selectors: Selector[]) {
    let rangeSelector: RangeSelector | null = null
    let textPositionSelector: TextPositionSelector | null = null
    let textQuoteSelector: TextQuoteSelector | null = null
    for (const s of selectors) {
      if (s.type === 'RangeSelector') {
        rangeSelector = s
        continue
      } else if (s.type === 'TextPositionSelector') {
        textPositionSelector = s
      } else if (s.type === 'TextQuoteSelector') {
        textQuoteSelector = s
      }
    }
    if (!rangeSelector || !textPositionSelector || !textQuoteSelector) {
      return
    }
    let range = this.matchByRangeSelector(rangeSelector)
    if (range && range.toString() === textQuoteSelector.exact) {
      return range
    }
    range = this.matchByTextPositionSelector(textPositionSelector)
    if (range && range.toString() === textQuoteSelector.exact) {
      return range
    }
    range = this.matchBySurroundedText(textQuoteSelector)
    if (range && diffDistance(range.toString(), textQuoteSelector.exact) < this.diffingTolerance) {
      return range
    }
    range = this.fuzzyMatchBySurroundedText(textQuoteSelector)
    if (range && diffDistance(range.toString(), textQuoteSelector.exact) < this.diffingTolerance) {
      return range
    }
    range = this.fuzzyMatchByTextQuoteSelector(textQuoteSelector)
    if (range && diffDistance(range.toString(), textQuoteSelector.exact) < this.diffingTolerance) {
      return range
    }
  }
  matchByRangeSelector(selector: RangeSelector) {
    const start = document.evaluate(
      selector.startContainer,
      this.root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
    if (!start) return
    const end = document.evaluate(
      selector.endContainer,
      this.root,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue
    if (!end) return
    const range = document.createRange()
    range.setStart(start, selector.startOffset)
    range.setEnd(end, selector.endOffset)
    return range
  }
  matchByTextPositionSelector(selector: TextPositionSelector) {
    const start = this.domTextMapper.matchByOffset(selector.start)
    if (!start) return
    const end = this.domTextMapper.matchByOffset(selector.end)
    if (!end) return
    const range = document.createRange()
    range.setStart(start.node, start.offset)
    range.setEnd(end.node, end.offset)
    return range
  }
  matchByTextQuoteSelector(selector: TextQuoteSelector) {
    this.domTextMapper.fuzzyMatchByText(selector.exact)
  }
  matchBySurroundedText({ prefix, suffix, exact }: TextQuoteSelector) {
    prefix = prefix.trimStart()
    suffix = suffix.trimEnd()
    const startOffset: number[] = [...this.domTextMapper.text.matchAll(new RegExp(prefix, 'gi'))]
      .filter(v => v.index)
      .map(v => v.index! + prefix.length)
    const endOffset: number[] = [...this.domTextMapper.text.matchAll(new RegExp(suffix, 'gi'))]
      .filter(v => v.index)
      .map(v => v.index!)
    if (startOffset.length == 0 || endOffset.length === 0) return
    const rangeOffset = [-1, -1]
    const minDistance = Infinity
    for (const start of startOffset) {
      for (const end of endOffset) {
        if (end < start) break
        const sliced = this.domTextMapper.text.slice(start, end)
        if (diffDistance(sliced, exact) < minDistance) {
          rangeOffset[0] = start
          rangeOffset[1] = end
        }
      }
    }
    if (rangeOffset[0] === -1 || rangeOffset[1] === -1) return
    const start = this.domTextMapper.matchByOffset(rangeOffset[0])
    if (!start) return
    const end = this.domTextMapper.matchByOffset(rangeOffset[1])
    if (!end) return
    const range = document.createRange()
    range.setStart(start.node, start.offset)
    range.setEnd(end.node, end.offset)
    return range
  }
  fuzzyMatchBySurroundedText({ prefix, suffix }: TextQuoteSelector) {
    prefix = prefix.trimStart()
    suffix = suffix.trimEnd()
    const start = this.domTextMapper.fuzzyMatchByText(prefix)?.[1]
    if (!start) return
    const end = this.domTextMapper.fuzzyMatchByText(suffix)?.[0]
    if (!end) return
    const range = document.createRange()
    range.setStart(start.node, start.offset)
    range.setEnd(end.node, end.offset)
    return range
  }
  fuzzyMatchByTextQuoteSelector(selector: TextQuoteSelector) {
    const matched = this.domTextMapper.fuzzyMatchByText(selector.exact)
    if (!matched) return
    const range = document.createRange()
    range.setStart(matched[0].node, matched[0].offset)
    range.setEnd(matched[1].node, matched[1].offset)
    return range
  }
  detect() {
    const selection = document.getSelection()
    if (!selection?.rangeCount) {
      throw new Error('No selection detected')
    }
    return this.detectFromRange(selection.getRangeAt(0))
  }
  detectFromRange(range: Range) {
    const rangeSelector = this.detectRangeSelector(range)
    const textPositionSelector = this.detectTextPositionSelector(range)
    if (!textPositionSelector) {
      throw new Error('No text position detected')
    }
    const textQuoteSelector = this.detectTextQuoteSelector(textPositionSelector.start, textPositionSelector.end)
    return [rangeSelector, textPositionSelector, textQuoteSelector]
  }
  detectRangeSelector(range: Range) {
    const startNode = range.startContainer
    const endNode = range.endContainer
    let startContainer = getPath(range.startContainer.parentElement!)
    let endContainer = getPath(range.endContainer.parentElement!)
    if (startNode.nodeType === Node.TEXT_NODE) {
      const index = [...startNode.parentElement!.childNodes]
        .filter(n => n.nodeType === Node.TEXT_NODE)
        // @ts-ignore
        .indexOf(startNode)
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
  detectTextPositionSelector(range: Range) {
    const startNode = range.startContainer
    const endNode = range.endContainer
    let start: number | undefined
    let end: number | undefined
    if (startNode.nodeType === Node.TEXT_NODE) {
      const pos = this.domTextMapper.getTextNodePosition(startNode as Text)
      if (pos !== void 0) {
        start = pos + range.startOffset
      }
    } else {
      const pos = this.domTextMapper.getTextNodePositionAfter(startNode.childNodes[range.startOffset])
      if (pos !== void 0) {
        start = pos
      }
    }
    if (endNode.nodeType === Node.TEXT_NODE) {
      const pos = this.domTextMapper.getTextNodePosition(endNode as Text)
      if (pos !== void 0) {
        end = pos + range.endOffset
      }
    } else {
      const pos = this.domTextMapper.getTextNodePositionAfter(endNode.childNodes[range.endOffset])
      if (pos !== void 0) {
        end = pos
      }
    }
    if (start === void 0 || end === void 0) {
      return
    }
    return {
      end,
      start,
      type: 'TextPositionSelector',
    }
  }
  detectTextQuoteSelector(startOffset: number, endOffset: number) {
    const SURROUNDED_LENGTH = 12
    const exact = this.domTextMapper.text.slice(startOffset, endOffset)
    const prefix = this.domTextMapper.text.slice(Math.max(0, startOffset - SURROUNDED_LENGTH), startOffset)
    const suffix = this.domTextMapper.text.slice(endOffset, endOffset + SURROUNDED_LENGTH)
    return {
      exact,
      prefix,
      suffix,
      type: 'TextQuoteSelector',
    }
  }
}
