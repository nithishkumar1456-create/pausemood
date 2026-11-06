/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border, 250 20% 88%))',
        input: 'hsl(var(--input, 250 20% 88%))',
        ring: 'hsl(var(--ring, 263 45% 55%))',
        background: 'hsl(var(--background, 260 50% 98%))',
        foreground: 'hsl(var(--foreground, 254 56% 16%))',
        primary: {
          DEFAULT: 'hsl(var(--primary-hsl, 263 45% 55%))',
          foreground: 'hsl(var(--primary-foreground, 0 0% 100%))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted, 255 25% 94%))',
          foreground: 'hsl(var(--muted-foreground, 258 20% 50%))',
        },
        card: {
          DEFAULT: 'hsl(var(--card, 0 0% 100%))',
          foreground: 'hsl(var(--card-foreground, 254 56% 16%))',
        },
        chart: {
          1: '#7c5cbf',
          2: '#22c55e',
          3: '#10b981',
          4: '#f9c784',
          5: '#ef4444',
        },
      },
      borderRadius: {
        lg: 'var(--radius, 1rem)',
        md: 'calc(var(--radius, 1rem) - 2px)',
        sm: 'calc(var(--radius, 1rem) - 4px)',
      },
    },
  },
  plugins: [],
}

