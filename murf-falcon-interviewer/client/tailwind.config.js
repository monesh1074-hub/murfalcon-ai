/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        neon: { violet: '#A855F7', cyan: '#22D3EE', pink: '#EC4899' },
      },
      fontFamily: {
        logo: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}