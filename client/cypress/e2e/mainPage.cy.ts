import { routeNames } from '../../src/utils/routeNames'

describe('Main page', () => {
	it('should redirect from main to login page if there is not logged in user', () => {
		cy.visit(routeNames.main.path)

		cy.url().should('eql', routeNames.auth.login.path)
	})

	it.only('should redirect from main to admin main page if the user logged in', () => {
		cy.visit(routeNames.main.path)

		cy.url().should('eql', routeNames.admin.path)
	})
})
