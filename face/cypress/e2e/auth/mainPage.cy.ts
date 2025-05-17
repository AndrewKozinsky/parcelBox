import { routeNames } from '../../../src/utils/routeNames'
import { checkIsPage, login } from '../utils/commands'
import { server } from '../utils/server'
import { usersConfig } from '../utils/users'

describe.skip('Main page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
		cy.wait(100)
	})

	it('should redirect from main to login page if there is not logged in user', () => {
		cy.visit(routeNames.main.path)

		checkIsPage(routeNames.auth.login.path)
	})
})
