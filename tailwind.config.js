/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-blue': '#0a192f',
        'neon-cyan': '#64ffda',
      },
    },
  },
  plugins: [],
}
