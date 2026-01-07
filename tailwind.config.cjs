/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.08), 0 4px 16px rgba(15, 23, 42, 0.06)",
      },
    },
  },
}

