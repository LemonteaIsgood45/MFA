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
    extend: {},
  },
  plugins: [],
};

export default config;