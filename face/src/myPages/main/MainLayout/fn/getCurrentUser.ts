import { ApolloClient } from '@apollo/client'
import {cookies} from 'next/headers'
import {
	AdminOutModel,
	AuthGetMeDocument,
	AuthRefreshTokenDocument, SenderOutModel
} from '../../../../graphql'
import getApolloClient from '../../ApolloClient'

export async function getCurrentUser(): Promise<null | SenderOutModel | AdminOutModel> {
	const gqiClient = getApolloClient()
	const cookieStore = await cookies()
	const accessToken = cookieStore.get('accessToken')?.value

	const userData = await getUserByAccessToken(gqiClient, accessToken)
	if (userData) return userData

	const newAccessTokenWasGot = await getNewAccessTokenByRefreshToken(gqiClient)
	if (!newAccessTokenWasGot) return null

	// Try to get user data with a fresh access token
	return await getUserByAccessToken(gqiClient)
}

async function getUserByAccessToken(gqiClient: ApolloClient<object>, accessToken?: string) {
	try {
		const { data } = await gqiClient.query({
			query: AuthGetMeDocument,
			context: {
				headers: accessToken ? {
					Cookie: `accessToken=${accessToken}`
				} : undefined
			}
		})
		return data.auth_getMe
	} catch (error) {
		console.error('Error getting user by access token:', error)
		return null
	}
}

async function getNewAccessTokenByRefreshToken(gqiClient: ApolloClient<object>) {
	try {
		const { data } = await gqiClient.query({
			query: AuthRefreshTokenDocument,
		})
		return data.auth_refreshToken
	} catch (error) {
		console.error('Error refreshing token:', error)
		return false
	}
}
