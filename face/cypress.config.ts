import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost',
		pageLoadTimeout: 3000,
		requestTimeout: 4000,
		responseTimeout: 4000,
		defaultBrowser: 'chrome',
		setupNodeEvents(on, config) {},
	},
})
