// CommonJS PostCSS config. Vitest/PostCSS may load CJS files via require,
// which avoids ESM `export` syntax errors. During tests we return an empty
// config to prevent loading Tailwind's PostCSS plugin which can require
// Vite/build runtime.
const isTest = !!process.env.VITEST || process.env.NODE_ENV === 'test';

if (isTest) {
  module.exports = {};
} else {
  module.exports = {
    plugins: ["@tailwindcss/postcss"],
  };
}
