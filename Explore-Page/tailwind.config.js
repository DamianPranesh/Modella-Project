import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        modella: {
          "base-100": "oklch(98% 0.003 247.858)",
          "base-200": "oklch(98% 0.003 247.858)",
          "base-300": "oklch(98% 0.003 247.858)",
          "base-content": "oklch(42% 0.095 57.708)",
          "primary": "oklch(98% 0.003 247.858)",
          "primary-content": "oklch(98% 0.002 247.839)",
          "secondary": "oklch(98% 0 0)",
          "secondary-content": "oklch(98% 0.001 106.423)",
          "accent": "oklch(77% 0.152 181.912)",
          "accent-content": "oklch(38% 0.063 188.416)",
          "neutral": "#DD8560",
          "neutral-content": "oklch(92% 0.004 286.32)",
          "info": "oklch(74% 0.16 232.661)",
          "info-content": "oklch(29% 0.066 243.157)",
          "success": "oklch(76% 0.177 163.223)",
          "success-content": "oklch(37% 0.077 168.94)",
          "warning": "oklch(82% 0.189 84.429)",
          "warning-content": "oklch(41% 0.112 45.904)",
          "error": "oklch(71% 0.194 13.428)",
          "error-content": "oklch(27% 0.105 12.094)",
          "border": "1px",
          "radius-selector": "0.5rem",
          "radius-field": "0.25rem",
          "radius-box": "0.5rem",
          "size-selector": "0.25rem",
          "size-field": "0.25rem",
          "depth": "1",
          "noise": "0",
        },
      },
    ],
  },
};