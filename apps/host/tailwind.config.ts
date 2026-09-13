import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    // Scan all packages inside your monorepo workspace:
    "../../packages/**/*.{js,ts,jsx,tsx}",
    "../shared-store/**/*.{js,ts,jsx,tsx}", // Adjust relative path to match your folder structure
  ],
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

export default config;