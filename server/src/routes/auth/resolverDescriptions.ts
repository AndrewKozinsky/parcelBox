import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { AuthResolver } from './auth.resolver'

export const authResolversDesc: Record<keyof typeof AuthResolver.prototype, string> = {
	hello: 'Hello World!',
	registerUser: `Register a user as a administrator.
	Possible errors:
	**${errorMessage.EmailIsNotConfirmed}** — the user is already registered, but doesn't confirm his email.
	**${errorMessage.emailIsAlreadyRegistered}** — the user is already registered and confirmed his email.`,
}
