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
	| 'makeRequestToMe'
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
			setLiveStatus(!!user ? 'finish' : 'makeRequestToMe')
		},
		[user],
	)
}

function useMakeRequestToMe(
	liveStatus: ProviderLiveStatus,
	setLiveStatus: React.Dispatch<React.SetStateAction<ProviderLiveStatus>>,
) {
	const { data, error, loading } = useAuthGetMe({ skip: liveStatus !== 'makeRequestToMe' })

	if (liveStatus === 'makeRequestToMe') {
		if (loading) {
			useUserStore.setState({ isLoading: true })
		} else {
			if (error) {
				useUserStore.setState({ isLoading: false, isError: true, user: null })
				setLiveStatus('makeRequestToRefreshToken')
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

	if (liveStatus === 'makeRequestToRefreshToken') {
		authRefreshToken()

		if (loading) {
			useUserStore.setState({ isLoading: true })
		} else {
			useUserStore.setState({ isLoading: false })

			if (error) {
				setLiveStatus('goToLoginPage')
			} else if (data) {
				setLiveStatus('makeRequestToMe')
			}
		}
	}
}
