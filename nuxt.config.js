module.exports = {
	mode: 'spa',
	components: true,
	head: {
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
		],
		link:[
			{rel: 'icon',type:'image/x-icon', href: '/favicon.ico'},
			{rel:'stylesheet', href:'https://fonts.googleapis.com/css2?family=Courier+Prime&display=swap'},
			{rel:'stylesheet', href:'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300&display=swap'},
			{rel:'stylesheet', href:'https://fonts.googleapis.com/css2?family=Roboto+Slab&display=swap'},
			{rel:'stylesheet', href:'https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Roboto+Slab&display=swap'}
		],
		title: 'TILK',
	}, // Headers of the page
	build: {
		extend (config, { isDev, isClient }) {
			if (isDev && isClient) {
				// Run ESLint on save
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					exclude: /(node_modules)/
				})
			}
			// Extend only webpack config for client-bundle
			if (isClient) { config.target = 'electron-renderer' }
		}
	},
	router:{
		middleware:[
			'reload'
		]
	},
	loading: { color: '#23F702'},
	dev: process.env.NODE_ENV === 'DEV',
	css: [
		'@/assets/css/global.css'
	],
	plugins:[
		'@/plugins/icons',
		'@/plugins/chartjs',
	],
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/vuetify',
		'bootstrap-vue/nuxt',
	],
}
