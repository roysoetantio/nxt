const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', 'class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			'arh-blue': '#0591D2',
  			'arh-green': '#65AF01',
  			'arh-amber': '#DEA202',
  			'arh-red': '#FF6401',
  			'arh-blue-light': '#DDF0FA',
  			'arh-green-light': '#E8F3D9',
  			'arh-amber-light': '#F9EDD0',
  			'arh-red-light': '#FFE4D4',
  			greyBG: '#F5F5F5',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		borderWidth: {
  			hairline: 'hairlineWidth()'
  		},
  		fontFamily: {
  			tc: ['NotoSansTC_400Regular'],
  			'tc-thin': ['NotoSansTC_100Thin'],
  			'tc-extralight': ['NotoSansTC_200ExtraLight'],
  			'tc-light': ['NotoSansTC_300Light'],
  			'tc-regular': ['NotoSansTC_400Regular'],
  			'tc-medium': ['NotoSansTC_500Medium'],
  			'tc-semibold': ['NotoSansTC_600SemiBold'],
  			'tc-bold': ['NotoSansTC_700Bold'],
  			'tc-extrabold': ['NotoSansTC_800ExtraBold'],
  			'tc-black': ['NotoSansTC_900Black']
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require('tailwindcss-animate')],
};
