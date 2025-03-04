import { LoginFormTest } from '../../../src/myPages/auth/login/LoginForm/fn/form'
import { routeNames } from '../../../src/utils/routeNames'
import { UserConfig } from './users'

export function login(userConfig: UserConfig) {
	cy.visit(routeNames.auth.login.path)
	cy.wait(100)

	const emailField = cy.get(LoginFormTest.emailField.query)
	emailField.type(userConfig.email)

	const passwordField = cy.get(LoginFormTest.passwordField.query)
	passwordField.type(userConfig.password + '{enter}')
}

export function checkIsPage(path: string) {
	cy.url().should('eql', 'http://localhost:3001' + path)
}

export function checkRadio(query: string, value: string) {
	cy.get(query).get('input[type="radio"]').check(value)
}
