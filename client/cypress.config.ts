import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3001',
		pageLoadTimeout: 2000,
		requestTimeout: 1500,
		responseTimeout: 1500,
		defaultBrowser: 'chrome',
		setupNodeEvents(on, config) {},
	},
})
