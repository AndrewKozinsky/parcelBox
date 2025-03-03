import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { ApolloClient, useApolloClient } from '@apollo/client'
import {
	AdminOutModel,
	AuthGetMeDocument,
	AuthRefreshTokenDocument,
	SenderOutModel,
	User_Role,
} from '../../../../graphql'
import { UserStore, useUserStore } from '../../../../stores/userStore'
import { routeNames } from '../../../../utils/routeNames'

export function useManageUserInStore() {
	const gqiClient = useApolloClient()
	const router = useRouter()
	const pathname = usePathname() // Get current route
	const senderUser = useUserStore((s) => s.senderUser)
	const adminUser = useUserStore((s) => s.adminUser)
	const isLoggedOut = useUserStore((s) => s.isLoggedOut)

	useEffect(
		function () {
			// If a user is in the auth pages
			if (pathname.startsWith(routeNames.auth.path + '/')) {
				if (adminUser) {
					// Redirect to admin main page
					router.push(routeNames.admin.path)
					return
				} else if (senderUser) {
					// Redirect to admin main page
					router.push(routeNames.sender.path)
					return
				} else if (isLoggedOut) {
					// Redirect to login page
					router.push(routeNames.auth.login.path)
				}
				// In other cases leave the user in an auth page
			}
			// If a user is in the content pages
			else {
				// Is the user logged out redirect him to login page
				if (isLoggedOut) {
					router.push(routeNames.auth.login.path)
					return
				}

				// If user data is in the store return
				if (adminUser) {
					router.push(routeNames.admin.path)
					return
				} else if (senderUser) {
					router.push(routeNames.sender.path)
					return
				}

				useUserStore.setState({ isLoading: true })

				// In other case try to get user data by tokens in cookies...
				userFetch.getUser(gqiClient).then((userData) => {
					if (!userData) {
						// Redirect to login page
						router.push(routeNames.auth.login.path)
						useUserStore.setState({ isLoading: false })
						return
					}

					const changeUserStoreObj: Partial<UserStore> = {
						isLoading: false,
					}

					if (userData.auth_getMe.role === User_Role.Admin) {
						changeUserStoreObj.adminUser = userData.auth_getMe as AdminOutModel
					} else if (userData.auth_getMe.role === User_Role.Sender) {
						changeUserStoreObj.senderUser = userData.auth_getMe as SenderOutModel
					}

					useUserStore.setState(changeUserStoreObj)
				})
			}
		},
		[senderUser, adminUser, isLoggedOut],
	)
}

const userFetch = {
	async getUser(gqiClient: ApolloClient<object>) {
		const userData = await this.getUserByAccessToken(gqiClient)
		if (userData) return userData

		const newAccessTokenWasGot = await this.getNewAccessTokenByRefreshToken(gqiClient)
		if (!newAccessTokenWasGot) return null

		// Try to get user data with a fresh access token
		return await this.getUserByAccessToken(gqiClient)
	},
	async getUserByAccessToken(gqiClient: ApolloClient<object>) {
		try {
			const { data } = await gqiClient.query({
				query: AuthGetMeDocument,
			})
			return data
		} catch (error) {
			return null
		}
	},
	async getNewAccessTokenByRefreshToken(gqiClient: ApolloClient<object>) {
		try {
			const { data } = await gqiClient.query({
				query: AuthRefreshTokenDocument,
			})
			return true
		} catch (error) {
			return false
		}
	},
}
