import { LoginFormTest } from '../../src/myPages/auth/login/LoginForm/fn/form'
import { routeNames } from '../../src/utils/routeNames'
import { checkIsPage, login } from './utils/commands'
import { server } from './utils/server'
import { usersConfig } from './utils/users'

describe.skip('Login page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
	})

	it('should show error if email and password fields filled with wrong data', () => {
		// Visit to the login page
		cy.visit(routeNames.auth.login.path)

		cy.wait(200)
		cy.get(LoginFormTest.emailField.query).type('admin@ma')
		cy.get(LoginFormTest.passwordField.query).type('12345')

		cy.get(LoginFormTest.form.query).contains('Введите электронную почту')
		cy.get(LoginFormTest.form.query).contains('Введите пароль')

		cy.get(LoginFormTest.submitButton.query).should('be.disabled')
	})

	it('should show error if email and password were filled correct, but user is not confirmed yet', () => {
		// Visit to the login page
		cy.visit(routeNames.auth.login.path)

		cy.wait(200)

		// Write data of the user with unconfirmed email
		cy.get(LoginFormTest.emailField.query).type(usersConfig.admin_1.email)
		cy.get(LoginFormTest.passwordField.query).type(usersConfig.admin_1.password)

		// Try to submit form
		cy.get(LoginFormTest.form.query).submit()

		// Error have to appears
		cy.get(LoginFormTest.form.query).contains('Почта зарегистрирована, но не подтверждена.')

		// Check the program didn't change address
		cy.wait(100)
		checkIsPage(routeNames.auth.login.path)
	})

	it('should redirect to admin page if the form was filled data of admin with confirmed email', () => {
		login(usersConfig.admin_4_conf)

		cy.getCookie('accessToken').should('exist')
		cy.getCookie('refreshToken').should('exist')

		// Check the program redirect to main admin page
		checkIsPage(routeNames.admin.path)
	})

	it('should redirect to sender page if the form was filled data of sender with confirmed email', () => {
		login(usersConfig.sender_3_conf)

		cy.getCookie('accessToken').should('exist')
		cy.getCookie('refreshToken').should('exist')

		// Check the program redirect to main admin page
		checkIsPage(routeNames.sender.path)
	})
})

describe.skip('A try to move to the login page if a user already logged in', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
	})

	it('should redirect from login page to admin main page if an admin logged in', () => {
		login(usersConfig.admin_4_conf)

		// Visit to the login page
		cy.visit(routeNames.auth.login.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.admin.path)
	})

	it('should redirect from login page to sender main page if a sender logged in', () => {
		login(usersConfig.sender_4_conf)

		// Visit to the login page
		cy.visit(routeNames.auth.login.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.sender.path)
	})
})
