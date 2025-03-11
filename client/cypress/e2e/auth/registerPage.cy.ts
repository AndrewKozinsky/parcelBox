import { RegisterFormTest } from '../../../src/myPages/auth/register/RegisterForm/fn/form'
import { routeNames } from '../../../src/utils/routeNames'
import { checkIsPage, login, isFormInputsDisabled, registerUserInRegisterPage } from '../utils/commands'
import { server } from '../utils/server'
import { usersConfig } from '../utils/users'

describe.skip('Register page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
		cy.wait(100)

		// Visit to the register page
		cy.visit(routeNames.auth.register.path)
		cy.wait(200)
	})

	it('should disable and enable submit button if there are errors', () => {
		// Fill form in with correct data.
		cy.get(RegisterFormTest.emailField.query).type(usersConfig.sender_1.email)
		cy.get(RegisterFormTest.passwordField.query).type(usersConfig.sender_1.password)
		cy.get(RegisterFormTest.passwordAgainField.query).type(usersConfig.sender_1.password)

		// Submit button should become enabled.
		cy.get(RegisterFormTest.submitButton.query).should('be.enabled')

		// Write email in wrong format.
		cy.get(RegisterFormTest.emailField.query).clear()
		cy.get(RegisterFormTest.emailField.query).type('admin@ma')

		// Submit button should become disabled.
		cy.get(RegisterFormTest.submitButton.query).should('be.disabled')

		// Correct email.
		cy.get(RegisterFormTest.emailField.query).clear()
		cy.get(RegisterFormTest.emailField.query).type(usersConfig.sender_1.email)

		// Submit button should become enabled.
		cy.get(RegisterFormTest.submitButton.query).should('be.enabled')
	})

	it('should show error if email, password, passwordAgain fields filled with wrong data', () => {
		cy.get(RegisterFormTest.emailField.query).type('admin@ma')
		cy.get(RegisterFormTest.passwordField.query).type('12345')
		cy.get(RegisterFormTest.passwordAgainField.query).type('1234')

		cy.get(RegisterFormTest.form.query).contains('Введите электронную почту')
		cy.get(RegisterFormTest.form.query).contains('Введите пароль')
		cy.get(RegisterFormTest.form.query).contains('Пароли не сходятся')

		cy.get(RegisterFormTest.submitButton.query).should('be.disabled')
	})

	it('should show error if a user typed corrected data of a user with unconfirmed email', () => {
		cy.get(RegisterFormTest.emailField.query).type(usersConfig.sender_1.email)
		cy.get(RegisterFormTest.passwordField.query).type(usersConfig.sender_1.password)
		cy.get(RegisterFormTest.passwordAgainField.query).type(usersConfig.sender_1.password)

		cy.get(RegisterFormTest.form.query).submit()

		cy.get(RegisterFormTest.submitButton.query).should('be.disabled')
		cy.get(RegisterFormTest.failMessage.query).contains('Почта зарегистрирована, но не подтверждена.')

		// Check the program didn't change address
		cy.wait(200)
		checkIsPage(routeNames.auth.register.path)
	})

	it('should show error if registered user data was typed', () => {
		cy.get(RegisterFormTest.emailField.query).type(usersConfig.admin_2_conf.email)
		cy.get(RegisterFormTest.passwordField.query).type(usersConfig.admin_2_conf.password)
		cy.get(RegisterFormTest.passwordAgainField.query).type(usersConfig.admin_2_conf.password)

		cy.get(RegisterFormTest.form.query).submit()

		cy.get(RegisterFormTest.submitButton.query).should('be.disabled')
		cy.get(RegisterFormTest.failMessage.query).contains('Почта уже зарегистрирована.')

		// Check the program didn't change address
		cy.wait(200)
		checkIsPage(routeNames.auth.register.path)
	})

	it('should successful register a new sender', () => {
		successfullyRegisterUserWithRole('sender')
	})

	it('should successful register a new admin', () => {
		successfullyRegisterUserWithRole('sender')
	})
})

function successfullyRegisterUserWithRole(role: 'admin' | 'sender') {
	registerUserInRegisterPage({ role, email: 'my@google.com', password: '12345000' })

	// Success message have to appear
	cy.get(RegisterFormTest.successMessage.query).contains(
		'Форма успешно отправлена. Проверьте письмо отправленное на google.com.',
	)

	// All inputs must be disabled
	isFormInputsDisabled(RegisterFormTest.form.query)

	// Check the program didn't change address
	cy.wait(200)
	checkIsPage(routeNames.auth.register.path)
}

describe.skip('Register page if a user already logged in', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
	})

	it('should redirect from register page to admin main page if an admin logged in', () => {
		login(usersConfig.admin_2_conf)

		// Visit to the register page
		cy.visit(routeNames.auth.register.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.admin.path)
	})

	it('should redirect from register page to sender main page if a sender logged in', () => {
		login(usersConfig.sender_3_conf)

		// Visit to the register page
		cy.visit(routeNames.auth.register.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.sender.path)
	})
})
