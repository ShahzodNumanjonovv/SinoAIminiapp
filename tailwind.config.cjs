/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#72908b", // Telegramga mos ko'k
          600: "#72908b",
        }
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
}