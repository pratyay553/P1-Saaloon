const config = {
  content: [
    "../../apps/*/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/*/features/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Custom SAloon Palette
        saloon: {
          black: "#111111",
          gold: "#D4AF37",
          white: "#FFFFFF",
          softGray: "#F5F5F5",
          emerald: "#00C49A", // Accent
          roseGold: "#B76E79", // Accent
          indigo: "#4B0082", // Accent
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"], // Example modern sans-serif
        heading: ["Playfair Display", "serif"], // Example elegant heading font
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

module.exports = config;
