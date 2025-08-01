/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			fontFamily: {
				heading: ['Libre Baskerville', 'serif'], // Victorian feel for headings
				body: ['Open Sans', 'sans-serif'], // Minimalist for body text
			},

			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))', // Deep, rich tone
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))',
				},
				gold: 'hsl(var(--gold))',
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
				victorian: {
							dark: '#003366', // Deep Blue (example, adjust as needed)
							medium: '#8B4513', // Saddle Brown
							light: '#D2B48C', // Tan
							cream: '#F5F5DC', // Beige
							gold: '#DAA520', // Goldenrod
							'gold-bright': '#FFD700', // Bright Gold
						},
				minimalist: {
							black: '#1A1A1A',
							gray: '#A0A0A0',
							lightGray: '#F0F0F0',
							white: '#FFFFFF',
						},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 1px)',
				sm: 'calc(var(--radius) - 2px)',
				xl: 'calc(var(--radius) + 2px)',
				'2xl': 'calc(var(--radius) + 4px)',
				'elegant-rounded-full': '9999px',
				'elegant-rounded-xl': 'calc(var(--radius) + 2px)',
				'elegant-rounded-lg': 'var(--radius)',
				'elegant-rounded-md': 'calc(var(--radius) - 1px)',
				'elegant-rounded-sm': 'calc(var(--radius) - 2px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'page-loader-spin': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'page-loader-spin': 'page-loader-spin 0.8s linear infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};