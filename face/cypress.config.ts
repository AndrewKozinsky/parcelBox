import { defineConfig } from 'cypress'

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3001',
		pageLoadTimeout: 2000,
		requestTimeout: 3000,
		responseTimeout: 3000,
		defaultBrowser: 'chrome',
		setupNodeEvents(on, config) {},
	},
})
