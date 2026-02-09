/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070a14',
          900: '#0b1020',
          800: '#0f1730'
        }
      }
    }
  },
  plugins: []
}
