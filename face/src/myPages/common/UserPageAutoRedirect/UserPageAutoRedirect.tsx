'use client'

import {usePathname, useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {useUserStore} from '../../../stores/userStore'
import {routeNames} from '../../../utils/routeNames'

function UserPageAutoRedirect() {
	const pathname = usePathname()
	const router = useRouter()

	const isLoading = useUserStore(s => s.isLoading)
	const adminUser = useUserStore(s => s.adminUser)
	const senderUser = useUserStore(s => s.senderUser)

	useEffect(function () {
		if (isLoading) return

		if (!adminUser && pathname.startsWith(routeNames.admin.path)) {
			router.push(routeNames.auth.login.path)
		} else if (!senderUser && pathname.startsWith(routeNames.sender.path)) {
			router.push(routeNames.auth.login.path)
		}
	}, [isLoading, adminUser, senderUser])

	return null
}

export default UserPageAutoRedirect
