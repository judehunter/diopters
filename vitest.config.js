/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    typecheck: {
      enabled: true,
    },
    coverage: {
      provider: 'v8',
      reporter: ['html'],
    },
  },
})
