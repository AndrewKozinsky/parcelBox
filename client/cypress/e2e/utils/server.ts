import { consts } from './common'

export const server = {
	// Clear the database
	clearDB() {
		cy.request('DELETE', consts.serverUrl + '/testing/all-data')
	},
	// Seed test data
	seedTestData() {
		cy.request('POST', consts.serverUrl + '/testing/seed-test-data')
	},
	async getUserByEmail(userEmail: string) {
		return new Promise((resolve) => {
			return cy
				.request({
					method: 'GET',
					url: consts.serverUrl + '/testing/user/', // Replace with your API endpoint
					qs: { email: userEmail }, // Query parameters
				})
				.then((res) => {
					resolve(res)
				})
		})
	},
}
