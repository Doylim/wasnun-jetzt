/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy:        '#0f1f3d',
        'navy-mid':  '#1a3260',
        teal:        '#00b89f',
        'teal-light':'#00d4b8',
        amber:       '#f5a623',
        cream:       '#faf8f4',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'serif'],
        sans:  ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
