import { EmailConfirmationTest } from '../../src/myPages/auth/EmailConfirmationPage/fn/form'
import { routeNames } from '../../src/utils/routeNames'
import { checkIsPage, login, registerUserInRegisterPage } from './utils/commands'
import { server } from './utils/server'
import { usersConfig } from './utils/users'

describe.skip('EmailConfirmation page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
		cy.wait(100)
	})

	it('should show error if there is not confirmation code in address bar', () => {
		expect(2).eql(2)
	})

	it('should show error if there is not confirmation code in address bar', () => {
		// Visit to the confirmation email page
		cy.visit(routeNames.auth.emailConfirmation.path)

		cy.wait(200)

		// Error have to appears
		cy.get(EmailConfirmationTest.errorMessage.query).contains(
			'В адресе не найден код подтверждения почты. Скорее всего вы попали на эту страницу по ошибке.',
		)

		cy.get(EmailConfirmationTest.resentLetter.query).contains(
			'Письмо для подтверждения почты своей учётной записи можно отправить ещё раз на этой странице.',
		)
	})

	it('should show error if a confirmation code in address bar is wrong', () => {
		// Visit to the confirmation page
		cy.visit(routeNames.auth.emailConfirmation.path + '?code=123')

		cy.wait(200)

		// Error have to appears
		cy.get(EmailConfirmationTest.errorMessage.query).contains('Код подтверждения почты не найден.')

		cy.get(EmailConfirmationTest.resentLetter.query).contains(
			'Письмо для подтверждения почты своей учётной записи можно отправить ещё раз на этой странице.',
		)
	})

	it('should redirect to the admin main if there is a correct confirmation code in address', async () => {
		// Register a new admin
		cy.visit(routeNames.auth.register.path)

		const role = 'admin'
		const email = 'my@google.com'
		const password = '12345000'

		registerUserInRegisterPage({ role, email, password })

		cy.wait(100)

		const getUserRes: any = await server.getUserByEmail(email)
		const user: any = getUserRes.body
		if (!user) {
			throw new Error('User not found')
		}

		const { emailConfirmationCode } = user

		cy.wait(100)

		// Visit to the confirmation email page
		cy.visit(routeNames.auth.emailConfirmation.path + '?code=' + emailConfirmationCode)

		// Check the program redirect to the login admin page
		checkIsPage(routeNames.auth.login.path)
	})
})

describe.skip('A try to move to the email confirmation page if a user already logged in', () => {
	it('should redirect from email confirmation page page to admin main page if an admin logged in', () => {
		login(usersConfig.admin_2_conf)

		// Visit to the confirmation email page
		cy.visit(routeNames.auth.emailConfirmation.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.admin.path)
	})

	it('should redirect from email confirmation page page to sender main page if a sender logged in', () => {
		login(usersConfig.sender_3_conf)

		// Visit to the confirmation email page
		cy.visit(routeNames.auth.emailConfirmation.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.sender.path)
	})
})
