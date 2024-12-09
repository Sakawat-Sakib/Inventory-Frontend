/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          light: '#404040'
        },
        secondary: {
          DEFAULT: '#FFFFFF',
          dark: '#E5E5E5'
        }
      }
    }
  },
  plugins: []
} 