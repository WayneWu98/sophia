import { defineConfig, toEscapedSelector as e } from 'unocss'
import presetWind from '@unocss/preset-wind'
import presetRemToPx from '@sophia/shared/build/uno/preset-rem-to-px'
import presetResolveRpx from '@sophia/shared/build/uno/preset-resolve-rpx'
import transformerVariantGroup from '@unocss/transformer-variant-group'

const normalizeSize = (size: string) => {
  if (+size + '' === size) {
    return `${size}px`
  }
  if (size.endsWith('rpx')) {
    return `${(100 * +size.replace('rpx', '')) / 390}vw`
  }
  return size
}

export default defineConfig({
  presets: [presetWind(), presetRemToPx({ baseFontSize: 4 }), presetResolveRpx()],
  transformers: [transformerVariantGroup()],
  rules: [
    [
      /^scrollbar-hidden$/,
      () => {
        return `.scrollbar-hidden::-webkit-scrollbar { display: none; } `
      },
    ],
    [
      /^ellipsis-(\d+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        return `
${selector} {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${+d};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
}
    `
      },
    ],
    [
      /^adapt-mb-(.+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        const size = normalizeSize(d)
        return `
${selector} {
  margin-bottom: calc(constant(safe-area-inset-bottom) + ${size});
  margin-bottom: calc(env(safe-area-inset-bottom) + ${size});
}
    `
      },
    ],
    [
      /^adapt-mt-(.+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        const size = normalizeSize(d)
        return `
${selector} {
  margin-top: calc(constant(safe-area-inset-top) + ${size});
  margin-top: calc(env(safe-area-inset-top) + ${size});
}
    `
      },
    ],
    [
      /^adapt-pb-(.+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        const size = normalizeSize(d)
        return `
${selector} {
  padding-bottom: calc(constant(safe-area-inset-bottom) + ${size});
  padding-bottom: calc(env(safe-area-inset-bottom) + ${size});
}
    `
      },
    ],
    [
      /^adapt-pt-(.+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        const size = normalizeSize(d)
        return `
${selector} {
  padding-top: calc(constant(safe-area-inset-top) + ${size});
  padding-top: calc(env(safe-area-inset-top) + ${size});
}
    `
      },
    ],
    [
      /^adapt-top-(.+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        const size = normalizeSize(d)
        return `
${selector} {
  top: calc(constant(safe-area-inset-top) + ${size});
  top: calc(env(safe-area-inset-top) + ${size});
}
    `
      },
    ],
    [
      /^adapt-bottom-(.+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        const size = normalizeSize(d)
        return `
${selector} {
  bottom: calc(constant(safe-area-inset-bottom) + ${size});
  bottom: calc(env(safe-area-inset-bottom) + ${size});
}
    `
      },
    ],
    [
      /^adapt-h-(.+)$/,
      ([, d], { rawSelector }) => {
        const selector = e(rawSelector)
        const size = normalizeSize(d)
        return `
${selector} {
  height: calc(constant(safe-area-inset-bottom) + ${size});
  height: calc(env(safe-area-inset-bottom) + ${size});
}
    `
      },
    ],
  ],
})
