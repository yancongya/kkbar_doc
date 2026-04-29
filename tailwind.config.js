/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: 'tw-',
	important: false,
	content: [
		"docs/**/*.{vue,ts,js}",
		"docs/.vitepress/theme/**/*.{vue,ts,js,css}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			 
			fontFamily: {
				poly: ['"poly"', "serif"],
			},
		},
	},
	plugins: [
		function({ addVariant }) {
			addVariant('firefox', ':-moz-any(&)')
		}
	],
}

