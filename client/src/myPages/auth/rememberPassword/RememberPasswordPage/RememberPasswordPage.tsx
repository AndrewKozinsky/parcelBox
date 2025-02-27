import { useRedirectToMainPageIfUserAuthorized } from '../../../common/auth/redirectToMainPageIfUserAuthorized'

export function RememberPasswordPage() {
	useRedirectToMainPageIfUserAuthorized()

	return <p>RememberPasswordPage</p>
}
