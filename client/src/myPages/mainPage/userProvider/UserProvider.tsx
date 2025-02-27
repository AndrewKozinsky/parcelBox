'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useAuthGetMe, useAuthRefreshToken } from '../../../graphql'
import { routeNames } from '../../../utils/routeNames'

export function UserProvider({ children }: { children: React.ReactNode }) {
	useSetUserToStore()

	return children
}

type ProviderLiveStatus =
	| 'checkForUserInStore'
	| 'makeRequestToMeFirstTime'
	| 'makeRequestToMeSecondTime'
	| 'makeRequestToRefreshToken'
	| 'finish'
	| 'goToLoginPage'

function useSetUserToStore() {
	const router = useRouter()

	const [liveStatus, setLiveStatus] = useState<ProviderLiveStatus>('checkForUserInStore')

	useDetermineWhetherRequestToMeNeeds(setLiveStatus)
	useMakeRequestToMe(liveStatus, setLiveStatus)
	useMakeRequestToRefreshToken(liveStatus, setLiveStatus)

	useEffect(
		function () {
			if (liveStatus === 'goToLoginPage') {
				// Redirect to login page
				router.push(routeNames.login)
			}
		},
		[liveStatus],
	)
}

function useDetermineWhetherRequestToMeNeeds(setLiveStatus: React.Dispatch<React.SetStateAction<ProviderLiveStatus>>) {
	const { user } = useUserStore.getState()

	useEffect(
		function () {
			setLiveStatus(!!user ? 'finish' : 'makeRequestToMeFirstTime')
		},
		[user],
	)
}

function useMakeRequestToMe(
	liveStatus: ProviderLiveStatus,
	setLiveStatus: React.Dispatch<React.SetStateAction<ProviderLiveStatus>>,
) {
	const { data, error, loading } = useAuthGetMe({ skip: liveStatus !== 'makeRequestToMeFirstTime' })

	if (liveStatus == 'makeRequestToMeFirstTime') {
		if (loading) {
			useUserStore.setState({ isLoading: true })
		} else {
			if (error) {
				useUserStore.setState({ isLoading: false })
				setLiveStatus('makeRequestToRefreshToken')
			} else if (data) {
				useUserStore.setState({ isLoading: false, isError: false, user: data.auth_getMe })
				setLiveStatus('finish')
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
				useUserStore.setState({ isLoading: false, isError: false, user: data.auth_getMe })
				setLiveStatus('finish')
			}
		}
	}
}

function useMakeRequestToRefreshToken(
	liveStatus: ProviderLiveStatus,
	setLiveStatus: React.Dispatch<React.SetStateAction<ProviderLiveStatus>>,
) {
	const [authRefreshToken, { loading, error, data }] = useAuthRefreshToken()

	if (liveStatus !== 'makeRequestToRefreshToken') return

	authRefreshToken()

	if (loading) {
		useUserStore.setState({ isLoading: true })
	} else {
		useUserStore.setState({ isLoading: false })

		if (error) {
			setLiveStatus('goToLoginPage')
		} else if (data) {
			setLiveStatus('makeRequestToMeSecondTime')
		}
	}
}
