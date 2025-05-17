import { useCallback } from 'react'
import {useRouter} from 'next/navigation'
import { useAuthLogout } from '../../../../graphql'
import { useUserStore } from '../../../../stores/userStore'
import {routeNames} from '../../../../utils/routeNames'

export function useGetOnLogoutBtnClick() {
	const router = useRouter()
	const [logoutRequest] = useAuthLogout({ fetchPolicy: 'no-cache' })

	return useCallback(function () {
		logoutRequest()
			.then(({ data }) => {
				useUserStore.getState().logout()
				router.push(routeNames.auth.login.path)
			})
			.catch((err) => {
				console.log(err)
				alert(err.message)
			})
	}, [])
}
