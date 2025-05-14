import { useEffect } from 'react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { usePathname, useRouter } from 'next/navigation'
import { ApolloClient, useApolloClient } from '@apollo/client'
import {
	AdminOutModel,
	AuthGetMeDocument,
	AuthRefreshTokenDocument,
	SenderOutModel,
	User_Role,
} from '../../../../graphql'
import { useUserStore } from '../../../../stores/userStore'
import { routeNames } from '../../../../utils/routeNames'

export function useManageUserInStore() {
	const gqiClient = useApolloClient()

	const router = useRouter()
	const pathname = usePathname()

	const senderUser = useUserStore((s) => s.senderUser)
	const adminUser = useUserStore((s) => s.adminUser)
	const isLoggedOut = useUserStore((s) => s.isLoggedOut)

	useEffect(
		function () {
			if (adminUser || senderUser) {
				// If a user is in the auth pages
				if (pathname.startsWith(routeNames.auth.path + '/')) {
					// Redirect to admin main page
					setTimeout(() => router.push(routeNames.main.path), 0)
					return
				}
			} else if (isLoggedOut) {
				if (pathname.startsWith(routeNames.auth.path + '/')) {
					return
				}

				// Redirect to login page
				setTimeout(() => router.push(routeNames.auth.login.path), 0)
				return
			}

			tryToGetUserAndSetToStore(gqiClient, router, pathname)
		},
		[senderUser, adminUser, isLoggedOut],
	)
}

function tryToGetUserAndSetToStore(gqiClient: ApolloClient<object>, router: AppRouterInstance, pathname: string) {
	useUserStore.setState({ isLoading: true })

	// In other case try to get user data by tokens in cookies...
	userFetch
		.getUser(gqiClient)
		.then((userData) => {
			if (!userData) {
				if (pathname.startsWith(routeNames.auth.path + '/')) {
					return
				}

				// Redirect to login page
				setTimeout(() => router.push(routeNames.auth.login.path), 0)
				return
			}

			if (userData.auth_getMe.role === User_Role.Admin) {
				useUserStore.setState({ adminUser: userData.auth_getMe as AdminOutModel })
			} else if (userData.auth_getMe.role === User_Role.Sender) {
				useUserStore.setState({ senderUser: userData.auth_getMe as SenderOutModel })
			}
		})
		.catch((err) => {
			console.error(err)
		})
		.finally(function () {
			useUserStore.setState({ isLoading: false })
		})
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
