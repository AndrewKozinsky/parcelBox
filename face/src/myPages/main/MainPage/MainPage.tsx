'use client'

import { useAutoRedirectToRoleOrAuthPage } from './fn/redirects'

export function MainPage() {
	useAutoRedirectToRoleOrAuthPage()

	return null
}
