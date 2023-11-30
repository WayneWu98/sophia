interface RangeSelector {
  endContainer: string
  endOffset: number
  startContainer: string
  startOffset: number
  type: 'RangeSelector'
}

interface TextPositionSelector {
  end: number
  start: number
  type: 'TextPositionSelector'
}

interface TextQuoteSelector {
  exact: string
  prefix: string
  suffix: string
  type: 'TextQuoteSelector'
}

type Selector = RangeSelector | TextPositionSelector | TextQuoteSelector

interface MatchingResult {
  node: Node
  offset: number
}

interface MatchingAnchor {
  range: Range
}
