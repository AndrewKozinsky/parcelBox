import { LoginFormTest } from '../../../src/myPages/auth/login/LoginForm/fn/form'
import { RegisterFormTest } from '../../../src/myPages/auth/register/RegisterForm/fn/form'
import { routeNames } from '../../../src/utils/routeNames'
import { consts } from './common'
import { UserConfig } from './users'

export function login(userConfig: UserConfig) {
	cy.visit(routeNames.auth.login.path)
	cy.wait(200)

	const emailField = cy.get(LoginFormTest.emailField.query)
	emailField.type(userConfig.email)

	const passwordField = cy.get(LoginFormTest.passwordField.query)
	passwordField.type(userConfig.password + '{enter}')
}

export function checkIsPage(path: string) {
	cy.url().should('eql', consts.clientUrl + path)
}

export function switchRadioTo(query: string, value: string) {
	cy.get(query).get('input[type="radio"]').check(value)
}

export function isFormInputsDisabled(query: string) {
	cy.get(query).get('input').should('have.attr', 'disabled')
}

export function registerUserInRegisterPage(props: { role: 'admin' | 'sender'; email: string; password: string }) {
	// Fill fields in
	cy.get(RegisterFormTest.emailField.query).type(props.email)
	cy.get(RegisterFormTest.passwordField.query).type(props.password)
	cy.get(RegisterFormTest.passwordAgainField.query).type(props.password)

	// Submit form
	cy.get(RegisterFormTest.form.query).submit()
}
