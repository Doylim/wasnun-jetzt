/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rot:        '#e01e1e',
        'rot-dunkel': '#b91c1c',
        'rot-hell': '#fef2f2',
        schwarz:    '#0a0a0a',
        'grau-dunkel': '#1a1a1a',
        'grau-mittel': '#6b6b6b',
        'grau-hell': '#f5f5f5',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
