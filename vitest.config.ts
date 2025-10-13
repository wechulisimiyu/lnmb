import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['convex/**/__tests__/**/*.test.*', 'convex/**/__tests__/*.test.*'],
    globals: true,
    isolate: true,
  },
});
