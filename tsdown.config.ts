import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  dts: false,
  fixedExtension: true,
  clean: true,
  minify: true,
  inlineOnly: false,
})
