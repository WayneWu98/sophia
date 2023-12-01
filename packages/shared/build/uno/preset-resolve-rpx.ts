import { definePreset } from '@unocss/core';

export const presetRemToPx = definePreset(() => {
  return {
    name: '@unocss/preset-resolve-rpx',
    postprocess(util) {
      return util.entries.forEach((entry) => {
        const value = entry[1];
        if (typeof value === 'string' && value.endsWith('rpx')) {
          entry[1] = `${(100 * +value.replace('rpx', '')) / 390}vw`;
        }
      });
    },
  };
});

export default presetRemToPx;
