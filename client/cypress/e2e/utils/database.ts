export const database = {
	// Clear the database
	clear() {
		cy.request('DELETE', 'http://localhost:3000/testing/all-data')
	},
	// Seed test data
	seedTestData() {
		cy.request('POST', 'http://localhost:3000/testing/seed-test-data')
	},
}
