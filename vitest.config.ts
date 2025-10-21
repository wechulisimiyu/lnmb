import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "convex/**/__tests__/**/*.test.*",
      "convex/**/__tests__/*.test.*",
      "src/**/__tests__/**/*.test.*",
      "src/**/__tests__/*.test.*",
    ],
    globals: true,
    isolate: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
