/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#08090a",
        panel: "#111214",
        accent: "#a855f7", // Cyber Purple
        teal: "#14b8a6",   // Neural Teal
      },
    },
  },
  plugins: [],
}