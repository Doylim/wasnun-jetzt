/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rot:          '#e01e1e',
        'rot-dunkel': '#b91c1c',
        'rot-hell':   '#fff0f0',
        schwarz:      '#0a0a0a',
        'grau-hell':  '#f5f5f5',
        'grau-mid':   '#888888',
      },
      fontFamily: {
        sans:        ['Barlow', 'sans-serif'],
        condensed:   ['"Barlow Condensed"', 'sans-serif'],
      },
      fontSize: {
        'huge':  ['clamp(3.5rem, 12vw, 9rem)', { lineHeight: '0.95' }],
        'big':   ['clamp(2rem, 6vw, 5rem)',    { lineHeight: '1.05' }],
      },
    },
  },
  plugins: [],
}
