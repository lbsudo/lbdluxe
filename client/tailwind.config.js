/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { fontFamily: { bebas: ['"Bebas Neue"', 'system-ui', 'sans-serif'], switzer: ['"Switzer-Regular"', 'system-ui', 'sans-serif'] } },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}