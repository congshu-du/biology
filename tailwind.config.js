export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // CNCB-inspired primary palette (approximate)
        primary: {
          50: "#eaf3ff",
          100: "#cfe6ff",
          200: "#9fcfff",
          300: "#6fb7ff",
          400: "#3f9fff",
          DEFAULT: "#1a59b0",
          600: "#164a99",
          700: "#123c7a",
          800: "#0d2d5b",
          900: "#081e3d",
        },
        // neutral and accent to complement the primary color
        neutral: {
          50: "#f7f9fb",
          100: "#eef3f8",
          200: "#dfeaf3",
          300: "#cfdfe9",
          DEFAULT: "#9aa6b4",
          700: "#6b7783",
          800: "#4a5560",
        },
        accent: {
          DEFAULT: "#ff8a00",
        },
      },
    },
  },
  plugins: [],
};
