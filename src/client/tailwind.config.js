/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        img: "15px",
        "img-lg": "20px",
      },
      colors: {
        btnPrimary: "var(--button-blue)",
        btnPrimary80: "var(--button-blue-80)",
        surface: "var(--surface)",
        column: "var(--status-column)",
        sub: "var(--text-sub)",
        "btn-hover": "var(--btn-hover)",
      },
    },
  },
  plugins: [],
};
