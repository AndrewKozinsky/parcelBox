'use client'

// import {useRouter} from 'next/navigation'
// import {useEffect} from 'react'
// import {useUserStore} from '../../../../stores/userStore'
// import {routeNames} from '../../../../utils/routeNames'


/*function AuthAutoRedirect() {
	const router = useRouter()

	const isLoading = useUserStore(s => s.isLoading)
	const adminUser = useUserStore(s => s.adminUser)
	const senderUser = useUserStore(s => s.senderUser)

	useEffect(function () {
		if (isLoading) return

		if (adminUser) {
			router.push(routeNames.admin.path)
		} else if (senderUser) {
			router.push(routeNames.sender.path)
		} else {
			router.push(routeNames.auth.login.path)
		}
	}, [isLoading, adminUser, senderUser])

	return null
}*/

// export default AuthAutoRedirect
