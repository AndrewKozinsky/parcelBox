import { useRedirectToMainPageIfUserAuthorized } from '../../../common/auth/redirectToMainPageIfUserAuthorized'

export function LoginPage() {
	useRedirectToMainPageIfUserAuthorized()

	return <p>LoginPage</p>
}
