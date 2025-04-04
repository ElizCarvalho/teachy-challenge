/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        colors: {
          primary: '#3B82F6',
          secondary: '#6B7280',
        },
      },
    },
    plugins: [],
  }