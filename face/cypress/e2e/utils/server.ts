import { consts } from './common'

export const server = {
	// Clear the database
	clearDB() {
		cy.request('DELETE', consts.serverUrl + '/testing/all-data')
	},
	// Seed initialization data
	seedInitData() {
		cy.request('POST', consts.serverUrl + '/initData/seed')
	},
	// Seed test data
	seedTestData() {
		cy.request('POST', consts.serverUrl + '/testing/seed')
	},
	getUserByEmail(userEmail: string) {
		return cy.request({
			method: 'GET',
			url: consts.serverUrl + '/testing/user/',
			qs: { email: userEmail },
		})
	},
}
