/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
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
        // Soft, layered elevation for mobile cards
        card: "0 2px 8px rgba(15,23,42,0.06), 0 10px 20px rgba(15,23,42,0.06)",
        sheet: "0 -6px 18px rgba(15,23,42,0.08)",
        btn: "0 2px 8px rgba(114,144,139,0.25)"
      }
    }
  },
  plugins: []
}
