/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        "surface-hover": "var(--color-surface-hover)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        danger: "var(--color-danger)",
        "danger-bg": "var(--color-danger-bg)",
        success: "var(--color-success)",
        "success-bg": "var(--color-success-bg)",
        warning: "var(--color-warning)",
        "warning-bg": "var(--color-warning-bg)",
      },
    },
  },
  plugins: [],
};
