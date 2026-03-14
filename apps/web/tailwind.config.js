/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      colors: {
        forest: {
          50:  "#EAF3DE",
          100: "#C0DD97",
          200: "#97C459",
          400: "#639922",
          600: "#3B6D11",
          800: "#27500A",
          900: "#173404",
        },
        amber: {
          50:  "#FAEEDA",
          100: "#FAC775",
          200: "#EF9F27",
          400: "#BA7517",
          600: "#854F0B",
          800: "#633806",
          900: "#412402",
        },
        teal: {
          50:  "#E1F5EE",
          100: "#9FE1CB",
          400: "#1D9E75",
          600: "#0F6E56",
          800: "#085041",
        },
        coral: {
          50:  "#FAECE7",
          100: "#F5C4B3",
          400: "#D85A30",
          600: "#993C1D",
          800: "#712B13",
        },
        ocean: {
          50:  "#E6F1FB",
          100: "#B5D4F4",
          400: "#378ADD",
          600: "#185FA5",
          800: "#0C447C",
        },
      },
    },
  },
  plugins: [],
};
