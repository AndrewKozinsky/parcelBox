'use client'

import {useEffect} from 'react'
import {useRouter} from 'next/navigation'
import {useUserStore} from '../../../../stores/userStore'
import {routeNames} from '../../../../utils/routeNames'


function AuthAutoRedirect() {
	const router = useRouter()

	const isLoading = useUserStore(s => s.isLoading)
	const adminUser = useUserStore(s => s.adminUser)
	const senderUser = useUserStore(s => s.senderUser)

	useEffect(function () {
		if (isLoading) return

		let path = ''

		if (adminUser) {
			path = routeNames.admin.path
		} else if (senderUser) {
			path = routeNames.sender.path
		}

		router.push(path)
	}, [isLoading, adminUser, senderUser])

	return null
}

export default AuthAutoRedirect
