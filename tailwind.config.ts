import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hcdr: {
          orange: "#E87722",
          "orange-hover": "#D16A1E",
          "orange-light": "#FFF5EC",
          dark: "#333333",
          body: "#555555",
          "light-grey": "#F5F5F5",
          "mid-grey": "#CCCCCC",
          success: "#2E7D32",
          info: "#1565C0",
          warm: "#FFFAF5"
        }
      },
      fontFamily: {
        sans: ["Poppins", "Helvetica Neue", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
