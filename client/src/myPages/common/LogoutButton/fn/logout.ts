import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthLogout } from '../../../../graphql'
import { useUserStore } from '../../../../stores/userStore'
import { routeNames } from '../../../../utils/routeNames'

export function useGetOnLogoutBtnClick() {
	const router = useRouter()
	const [logoutRequest] = useAuthLogout()

	return useCallback(function () {
		logoutRequest()
			.then(({ data }) => {
				console.log('Successfully logged out')
				useUserStore.setState({ adminUser: null, senderUser: null })

				/*setTimeout(() => {
					console.log('Redirecting to login')
					router.push(routeNames.auth.login.path)
				}, 200)*/
			})
			.catch((err) => {
				console.log(err)
				alert(err.message)
			})
	}, [])
}
