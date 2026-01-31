/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode if we use it, but we might just use data-theme
  theme: {
    extend: {
      colors: {
        // We will define these in CSS but can reference them here if we want
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        text: "var(--color-text)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Premium font feeling
      }
    },
  },
  plugins: [],
}

