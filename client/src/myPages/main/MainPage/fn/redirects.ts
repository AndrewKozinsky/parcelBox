import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useUserStore } from '../../../../stores/userStore'
import { routeNames } from '../../../../utils/routeNames'

export function useRedirectToRoleMainPageIfUserAuthorized() {
	const router = useRouter()

	const adminUser = useUserStore((s) => s.adminUser)
	const senderUser = useUserStore((s) => s.senderUser)

	useEffect(
		function () {
			if (!adminUser && !senderUser) return

			if (adminUser) {
				router.push(routeNames.admin.path)
			}
			if (senderUser) {
				router.push(routeNames.sender.path)
			}
		},
		[adminUser, senderUser],
	)
}
