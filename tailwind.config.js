/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        "paper-2": "var(--paper-2)",
        "paper-3": "var(--paper-3)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        hairline: "var(--hairline)",
        "hairline-2": "var(--hairline-2)",
        terracotta: "var(--terracotta)",
        "terracotta-fg": "var(--terracotta-fg)",
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Songti SC", "serif"],
        sans: ["var(--font-hanken)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        "4": "14px",
        "5": "20px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
  ],
};
