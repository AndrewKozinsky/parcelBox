import { EmailConfirmationTest } from '../../src/myPages/auth/EmailConfirmationPage/fn/form'
import { routeNames } from '../../src/utils/routeNames'
import { checkIsPage, login, registerUserInRegisterPage } from './utils/commands'
import { server } from './utils/server'
import { users } from './utils/users'

describe('EmailConfirmation page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedTestData()
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
		// Visit to the n page
		cy.visit(routeNames.auth.emailConfirmation.path + '?code=123')

		cy.wait(200)

		// Error have to appears
		cy.get(EmailConfirmationTest.errorMessage.query).contains('Код подтверждения почты не найден.')

		cy.get(EmailConfirmationTest.resentLetter.query).contains(
			'Письмо для подтверждения почты своей учётной записи можно отправить ещё раз на этой странице.',
		)
	})

	it.only('should redirect to the admin main if there is a correct confirmation code in address', async () => {
		// Register a new admin
		cy.visit(routeNames.auth.register.path)
		/*const role = 'admin'
		const email = 'my@google.com'
		const password = '12345000'

		registerUserInRegisterPage({ role, email, password })

		const user: any = await server.getUserByEmail(email)
		console.log(user.body)*/

		// Visit to the confirmation email page
		// cy.visit(routeNames.auth.emailConfirmation.path + '?code=123')

		// Check the program redirect to the login admin page
		// cy.wait(100)
		// checkIsPage(routeNames.auth.login.path)
	})
})

describe.skip('A try to move to the email confirmation page if a user already logged in', () => {
	it('should redirect from email confirmation page page to admin main page if an admin logged in', () => {
		login(users.confirmedAdmin)

		// Visit to the confirmation email page
		cy.visit(routeNames.auth.emailConfirmation.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.admin.path)
	})

	it('should redirect from email confirmation page page to sender main page if a sender logged in', () => {
		login(users.confirmedSender)

		// Visit to the confirmation email page
		cy.visit(routeNames.auth.emailConfirmation.path)

		// It has to redirect to the admin main page
		checkIsPage(routeNames.sender.path)
	})
})
