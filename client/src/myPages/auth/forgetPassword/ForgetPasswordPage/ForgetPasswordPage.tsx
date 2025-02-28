import { useRedirectToMainPageIfUserAuthorized } from '../../../common/auth/redirectToMainPageIfUserAuthorized'

export function ForgetPasswordPage() {
	useRedirectToMainPageIfUserAuthorized()

	return <p>RememberPasswordPage</p>
}
