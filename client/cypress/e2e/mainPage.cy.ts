import { routeNames } from '../../src/utils/routeNames'
import { checkIsPage, login } from './utils/commands'
import { server } from './utils/server'
import { users } from './utils/users'

describe.skip('Main page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedTestData()
	})

	it('should redirect from main to login page if there is not logged in user', () => {
		cy.visit(routeNames.main.path)

		checkIsPage(routeNames.auth.login.path)
	})

	it('should redirect from main to admin main page if an admin logged in', () => {
		login(users.confirmedAdmin)

		// Visit to the main page
		cy.visit(routeNames.main.path)
		checkIsPage(routeNames.admin.path)
	})

	it('should redirect from main to sender main page if a sender logged in', () => {
		login(users.confirmedSender)

		// Visit to the main page
		cy.visit(routeNames.main.path)
		checkIsPage(routeNames.sender.path)
	})
})
