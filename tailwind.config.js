/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // ✅ This makes Tailwind scan all React files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
