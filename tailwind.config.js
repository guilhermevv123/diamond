/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00b4d8", // Diamond Blue
          dark: "#0077b6",
          light: "#90e0ef",
          glass: "rgba(0, 180, 216, 0.15)",
        },
        navy: {
          950: "#02040a",
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
        },
        secondary: {
          DEFAULT: "#7209b7",
          dark: "#560bad",
          light: "#b5179e",
        },
        success: {
          DEFAULT: "#22c55e",
          dark: "#16a34a",
          light: "#bbf7d0",
        },
        danger: {
          DEFAULT: "#ef4444",
          dark: "#dc2626",
          light: "#fecaca",
        },
        warning: {
          DEFAULT: "#f59e0b",
          dark: "#d97706",
          light: "#fef3c7",
        },
        info: {
          DEFAULT: "#3b82f6",
          dark: "#2563eb",
          light: "#dbeafe",
        },
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
      },
      backgroundImage: {
        "diamond-gradient": "linear-gradient(135deg, #00b4d8 0%, #90e0ef 100%)",
        "dark-gradient": "linear-gradient(to bottom right, #0f172a, #02040a)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
    },
  },
  plugins: [],
};
