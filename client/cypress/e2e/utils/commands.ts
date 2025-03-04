import { LoginFormTest } from '../../../src/myPages/auth/login/LoginForm/fn/form'
import { routeNames } from '../../../src/utils/routeNames'
import { UserConfig } from './users'

export function login(userConfig: UserConfig) {
	cy.visit(routeNames.auth.login.path)
	cy.get(LoginFormTest.emailField.query).type(userConfig.email)
	cy.get(LoginFormTest.passwordField.query).type(userConfig.password + '{enter}')
}

export function checkIsPage(path: string) {
	cy.url().should('eql', 'http://localhost:3001' + path)
}
