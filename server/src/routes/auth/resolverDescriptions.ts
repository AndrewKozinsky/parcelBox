import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { AuthResolver } from './auth.resolver'

export const authResolversDesc: Record<keyof typeof AuthResolver.prototype, string> = {
	registerAdmin: `Register a user as a administrator.
	Possible errors:
	**${errorMessage.emailIsNotConfirmed}** — the user is already registered, but doesn't confirm his email.
	**${errorMessage.emailIsAlreadyRegistered}** — the user is already registered and confirmed his email.`,
	registerSender: `Register a user as a administrator.
	Possible errors:
	**${errorMessage.emailIsNotConfirmed}** — the user is already registered, but doesn't confirm his email.
	**${errorMessage.emailIsAlreadyRegistered}** — the user is already registered and confirmed his email.`,
	confirmEmail: `User email confirmation.
	Possible errors:
	**${errorMessage.emailConfirmationCodeNotFound}** — email confirmation code is not found in the database.
	**${errorMessage.emailConfirmationCodeIsExpired}** — email confirmation code is expired.`,
	login: `User login
	Possible errors:
	**${errorMessage.emailOrPasswordDoNotMatch}** — there is not any user with passed email and password.
	**${errorMessage.emailIsNotConfirmed}** — user email is not confirmed yet.`,
	resendConfirmationEmail: `Send email confirmation email one more time
	Possible errors:
	**${errorMessage.emailNotFound}** — passed email is not registered yet.
	**${errorMessage.emailIsAlreadyConfirmed}** — email is already confirmed.`,
	logout: `User logout
	Possible errors:
	**${errorMessage.refreshTokenIsNotValid}** — refresh token is not valid`,
	getNewAccessAndRefreshToken: 'Get new access and refresh token',
	getMe: 'Get current user data',
}
