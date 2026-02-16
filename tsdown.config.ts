import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  dts: false,
  fixedExtension: true,
  clean: true,
  external: [
    'miniprogram-automator',
  ],
  inlineOnly: false,
})
