import { useRedirectToRoleMainPageIfUserAuthorized } from '../../common/autoRedirect/redirects'

export function MainPage() {
	useRedirectToRoleMainPageIfUserAuthorized()

	return null
}
