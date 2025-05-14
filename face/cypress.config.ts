import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost',
		pageLoadTimeout: 2500,
		requestTimeout: 3500,
		responseTimeout: 3500,
		defaultBrowser: 'chrome',
		setupNodeEvents(on, config) {},
	},
})
