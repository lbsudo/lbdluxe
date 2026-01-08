/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    fontFamily: {
      bebas: ['"Bebas Neue"', 'system-ui', 'sans-serif'],
      switzer: ['"Switzer-Regular"', 'system-ui', 'sans-serif'],
    },
    keyframes: {
      shimmer: {
        '0%': { backgroundPosition: '-200% 0' },
        '100%': { backgroundPosition: '200% 0' },
      },
    },
    animation: {
      shimmer: 'shimmer 2s infinite ease-in-out',
    },
  },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}