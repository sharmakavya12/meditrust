/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  
    "./index.html",                
  ],
  theme: {
    extend: {
      colors: {
        primary:"#15803d", // Tailwind Green-700
      },
       gridTemplateColumns: { 
                'auto': 'repeat(auto-fill, minmax(200px, 1fr))' 
            }
    },
  },
  plugins: [],
}
