/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Inclua arquivos Vue e outros tipos relevantes
  ],
  theme: {
    extend: {
      colors: {
        'primary-950': '#122222',
        'primary-900': '#1c3535',
        'primary-500': '#337a7a',
        success: '#7e5bef',
        error: '#ff49db',
      },
    },
  },
  plugins: [],
}
