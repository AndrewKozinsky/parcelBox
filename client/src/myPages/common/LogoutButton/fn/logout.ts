import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthLogout } from '../../../../graphql'
import { useUserStore } from '../../../../stores/userStore'

export function useGetOnLogoutBtnClick() {
	const router = useRouter()
	const [logoutRequest] = useAuthLogout()

	return useCallback(function () {
		logoutRequest()
			.then(({ data }) => {
				console.log('Successfully logged out')
				useUserStore.getState().logout()
			})
			.catch((err) => {
				console.log(err)
				alert(err.message)
			})
	}, [])
}
