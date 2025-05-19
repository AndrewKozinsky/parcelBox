import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '../../../../stores/userStore'
import { routeNames } from '../../../../utils/routeNames'

export function useAutoRedirectToRoleOrAuthPage() {
	const router = useRouter()

	const adminUser = useUserStore((s) => s.adminUser)
	const senderUser = useUserStore((s) => s.senderUser)
	const isLoading = useUserStore((s) => s.isLoading)

	useEffect(
		function () {
			if (isLoading) return

			let nextPath: string = ''

			if (adminUser) {
				nextPath = routeNames.admin.path
			} else if (senderUser) {
				nextPath = routeNames.sender.path
			} else {
				nextPath = routeNames.auth.login.path
			}

			router.push(nextPath)
		},
		[isLoading],
	)
}
