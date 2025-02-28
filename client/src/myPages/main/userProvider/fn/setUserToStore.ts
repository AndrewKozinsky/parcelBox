import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
	AdminOutModel,
	AuthGetMe,
	SenderOutModel,
	useAuthGetMe,
	useAuthRefreshToken,
	User_Role,
} from '../../../../graphql'
import { UserStore, useUserStore } from '../../../../stores/userStore'
import { routeNames } from '../../../../utils/routeNames'

type LiveStatus =
	| 'checkForUserInStore'
	| 'makeRequestToMeFirstTime'
	| 'makeRequestToMeSecondTime'
	| 'makeRequestToRefreshToken'
	| 'finish'
	| 'goToLoginPage'

/**
 * This hook checks for user data in useUserStore.
 * If there is nothing there then tries to get current user data from the server from auth/me route by access token cookie.
 * If there is valid access token cookie it gets user data and set in userStore.
 * Otherwise makes a request to auth/refreshTokens to get new access and refresh tokens.
 * If this attempt successful then thies to make a new request to auth/me route to get current user data.
 * It the attempt is failed then make a redirect to login page so that user can log in to system.
 */
export function useManageUserInStore() {
	const router = useRouter()
	const pathname = usePathname() // Get current route

	const [liveStatus, setLiveStatus] = useState<LiveStatus>('checkForUserInStore')

	useDetermineWhetherRequestToMeNeeds(setLiveStatus)
	useMakeRequestToMe(liveStatus, setLiveStatus)
	useMakeRequestToRefreshToken(liveStatus, setLiveStatus)

	useEffect(
		function () {
			if (pathname.startsWith(routeNames.auth.path + '/')) return

			if (liveStatus === 'goToLoginPage') {
				// Redirect to login page
				router.push(routeNames.auth.login.path)
			}
		},
		[liveStatus],
	)
}

/**
 * Check if user data is already exists in store.
 * If there isn't any user data in store set status to make a request to get data about current user from the server
 * @param setLiveStatus
 */
function useDetermineWhetherRequestToMeNeeds(setLiveStatus: React.Dispatch<React.SetStateAction<LiveStatus>>) {
	const { senderUser } = useUserStore.getState()

	useEffect(
		function () {
			setLiveStatus(!!senderUser ? 'finish' : 'makeRequestToMeFirstTime')
		},
		[senderUser],
	)
}

/**
 * Check for makeRequestToMe* status and run a request to auth/me route to get user data.
 * @param liveStatus
 * @param setLiveStatus
 */
function useMakeRequestToMe(liveStatus: LiveStatus, setLiveStatus: React.Dispatch<React.SetStateAction<LiveStatus>>) {
	const { data, error, loading } = useAuthGetMe({ skip: liveStatus !== 'makeRequestToMeFirstTime' })

	useEffect(
		function () {
			if (liveStatus == 'makeRequestToMeFirstTime') {
				if (loading) {
					useUserStore.setState({ isLoading: true })
				} else {
					if (error) {
						useUserStore.setState({ isLoading: false })
						setLiveStatus('makeRequestToRefreshToken')
					} else if (data) {
						dataWasGotSuccessful(data)
					}
				}
			} else if (liveStatus == 'makeRequestToMeSecondTime') {
				if (loading) {
					useUserStore.setState({ isLoading: true })
				} else {
					if (error) {
						useUserStore.setState({ isLoading: false })
						setLiveStatus('goToLoginPage')
					} else if (data) {
						dataWasGotSuccessful(data)
					}
				}
			}
		},
		[liveStatus, loading],
	)

	function dataWasGotSuccessful(data: AuthGetMe) {
		const changeUserStoreObj: Partial<UserStore> = {
			isLoading: false,
			isError: false,
		}

		if (data.auth_getMe.role === User_Role.Admin) {
			changeUserStoreObj.adminUser = data.auth_getMe as AdminOutModel
		} else if (data.auth_getMe.role === User_Role.Sender) {
			changeUserStoreObj.senderUser = data.auth_getMe as SenderOutModel
		}

		useUserStore.setState(changeUserStoreObj)

		setLiveStatus('finish')
	}
}

/**
 * Check for makeRequestToRefreshToken status and run a request to auth/refreshTokens route to get a new access token.
 * @param liveStatus
 * @param setLiveStatus
 */
function useMakeRequestToRefreshToken(
	liveStatus: LiveStatus,
	setLiveStatus: React.Dispatch<React.SetStateAction<LiveStatus>>,
) {
	const [authRefreshToken] = useAuthRefreshToken()

	useEffect(
		function () {
			if (liveStatus !== 'makeRequestToRefreshToken') return

			authRefreshToken()
				.then(() => {
					setLiveStatus('makeRequestToMeSecondTime')
				})
				.catch(() => {
					setLiveStatus('goToLoginPage')
				})
				.finally(() => {
					useUserStore.setState({ isLoading: false })
				})
		},
		[liveStatus],
	)
}
