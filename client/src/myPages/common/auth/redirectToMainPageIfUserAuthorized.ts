import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '../../../stores/userStore'
import { routeNames } from '../../../utils/routeNames'

export function useRedirectToMainPageIfUserAuthorized() {
	const router = useRouter()
	const { senderUser } = useUserStore.getState()

	useEffect(
		function () {
			if (!senderUser) return

			router.push(routeNames.main.path)
		},
		[senderUser],
	)
}
