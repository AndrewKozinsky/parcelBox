import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '../../../stores/userStore'
import { routeNames } from '../../../utils/routeNames'

export function useRedirectToMainPageIfUserAuthorized() {
	const router = useRouter()
	const { user } = useUserStore.getState()

	useEffect(
		function () {
			if (!user) return

			router.push(routeNames.main)
		},
		[user],
	)
}
