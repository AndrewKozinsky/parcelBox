'use client'

import React from 'react'
import { useUserStore } from '../../../stores/userStore'
import { useManageUserInStore } from './fn/setUserToStore'

/**
 * This component checks for user data in useUserStore.
 * If there is nothing there then tries to get current user data from the server.
 * If this attempt fails it makes a redirect to login page.
 * @param children
 * @constructor
 */
export function UserProvider({ children }: { children: React.ReactNode }) {
	const isUserLoading = useUserStore((s) => s.isLoading)

	useManageUserInStore()

	if (isUserLoading) {
		return <p>Loading...</p>
	}

	return children
}
