import { useRedirectToMainPageIfUserAuthorized } from '../../common/auth/redirectToMainPageIfUserAuthorized'

export function RegisterPage() {
	useRedirectToMainPageIfUserAuthorized()

	return <p>RegisterPage</p>
}
