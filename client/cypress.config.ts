import { defineConfig } from 'cypress'
import base = Mocha.reporters.base

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3001',
		pageLoadTimeout: 1000,
		requestTimeout: 1000,
		responseTimeout: 1000,
		defaultBrowser: 'Chrome',
		setupNodeEvents(on, config) {},
	},
})
