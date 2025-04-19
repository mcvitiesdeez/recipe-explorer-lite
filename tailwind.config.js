export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Arial", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        poppins: ["PoppinsRegular", "sans-serif"],
        "poppins-black": ["PoppinsBlack", "sans-serif"],
        "poppins-bold": ["PoppinsBold", "sans-serif"],
        "poppins-italic": ["PoppinsItalic", "sans-serif"],
        "poppins-semibold": ["PoppinsSemiBold", "sans-serif"],
      },
    },
  },
  plugins: [],
};
