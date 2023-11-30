
## Re-attach the dom

1. find by RangeSelector (dom has been changed)
   1. not found, then skip
   2. found, then compare text with the saved in the TextQuoteSelector
       1. match, then re-attach
       2. not match, then skip
2. find by TextPositionSelector (dom structure changed, but text not)
   1. not found, then skip
   2. found, then compare text with the saved in the TextQuoteSelector
      1. match, then re-attach
      2. not match, then skip
3. search around the expected start position by leading text stored in the TextPositionSelector, and search around the expected end position by trailing text stored in the TextPositionSelector. Find the text between the two positions.
   1. not found, then skip
   2. found, compare with the saved in the TextQuoteSelector
      1. not match, or fuzzy match with a large differences, then skip
      2. match, or fuzzy match with a small differences, then re-attach
4. just fuzzy search the text in the whole document, and find the one that has the smallest differences

Reference:
 - Fuzzy Search in JavaScript: [diff-match-patch](https://github.com/google/diff-match-patch)

