import { RCLFormTest } from '../../../src/myPages/auth/resendConfirmationLetter/ResendConfirmationLetterForm/fn/form'
import { routeNames } from '../../../src/utils/routeNames'
import { checkIsPage, isFormInputsDisabled, login } from '../utils/commands'
import { server } from '../utils/server'
import { usersConfig } from '../utils/users'

describe.skip('Resend confirmation letter page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
		cy.wait(100)

		// Visit to the register page
		cy.visit(routeNames.auth.resendConfirmationLetter.path)
		cy.wait(200)
	})

	it('should disable and enable the submit button if there are errors', () => {
		// Fill form in with correct data.
		cy.get(RCLFormTest.emailField.query).type(usersConfig.sender_1.email)

		// Submit button should become enabled.
		cy.get(RCLFormTest.submitButton.query).should('be.enabled')

		// Write email in wrong format.
		cy.get(RCLFormTest.emailField.query).clear()
		cy.get(RCLFormTest.emailField.query).type('admin@ma')

		// Submit button should become disabled.
		cy.get(RCLFormTest.submitButton.query).should('be.disabled')

		// Correct email.
		cy.get(RCLFormTest.emailField.query).clear()
		cy.get(RCLFormTest.emailField.query).type(usersConfig.sender_1.email)

		// Submit button should become enabled.
		cy.get(RCLFormTest.submitButton.query).should('be.enabled')
	})

	it('should show an error if email filled with wrong data', () => {
		cy.get(RCLFormTest.emailField.query).type('admin@ma')

		cy.get(RCLFormTest.form.query).contains('Введите электронную почту')

		cy.get(RCLFormTest.submitButton.query).should('be.disabled')
	})

	it('should show an error if a user with provided email is not exists', () => {
		cy.get(RCLFormTest.emailField.query).type('wrong@email.ru')

		cy.get(RCLFormTest.form.query).submit()

		// Check the program didn't change address
		cy.wait(200)
		checkIsPage(routeNames.auth.resendConfirmationLetter.path)
	})

	it('should show an error if a user with provided email is not exists', () => {
		cy.get(RCLFormTest.emailField.query).type(usersConfig.admin_1.email)

		cy.get(RCLFormTest.form.query).submit()

		cy.get(RCLFormTest.successMessage.query).contains('Письмо отправлено. Проверьте на mail.com.')

		isFormInputsDisabled(RCLFormTest.form.query)
	})

	it('should show an error if a user is already registered', () => {
		cy.get(RCLFormTest.emailField.query).type(usersConfig.admin_2_conf.email)

		cy.get(RCLFormTest.form.query).submit()

		cy.get(RCLFormTest.failMessage.query).contains('Почта уже подтверждена.')

		// Check the program didn't change address
		cy.wait(200)
		checkIsPage(routeNames.auth.resendConfirmationLetter.path)
	})
})

describe.skip('Resend confirmation letter page if a user already logged in', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
	})

	it('should redirect from register page to admin main page if an admin logged in', () => {
		login(usersConfig.admin_2_conf)

		// Visit to the confirmation letter page
		cy.visit(routeNames.auth.resendConfirmationLetter.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.admin.path)
	})

	it('should redirect from register page to sender main page if a sender logged in', () => {
		login(usersConfig.sender_3_conf)

		// Visit to the confirmation letter page
		cy.visit(routeNames.auth.resendConfirmationLetter.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.sender.path)
	})
})
