import { useRedirectToRoleMainPageIfUserAuthorized } from './fn/redirects'

export function MainPage() {
	useRedirectToRoleMainPageIfUserAuthorized()

	return null
}
