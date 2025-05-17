import { ApolloClient } from '@apollo/client'
import {
	AdminOutModel,
	AuthGetMeDocument,
	AuthRefreshTokenDocument, SenderOutModel
} from '../../../../graphql'
import getApolloClient from '../../ApolloClient'

export async function getCurrentUser(): Promise<null | SenderOutModel | AdminOutModel> {
	const gqiClient = getApolloClient()

	const userData = await getUserByAccessToken(gqiClient)
	if (userData) return userData

	const newAccessTokenWasGot = await getNewAccessTokenByRefreshToken(gqiClient)
	if (!newAccessTokenWasGot) return null

	// Try to get user data with a fresh access token
	return await getUserByAccessToken(gqiClient)
}

async function getUserByAccessToken(gqiClient: ApolloClient<object>) {
	try {
		const { data } = await gqiClient.query({
			query: AuthGetMeDocument,
		})
		return data
	} catch (error) {
		return null
	}
}

async function getNewAccessTokenByRefreshToken(gqiClient: ApolloClient<object>) {
	try {
		const { data } = await gqiClient.query({
			query: AuthRefreshTokenDocument,
		})
		return true
	} catch (error) {
		return false
	}
}
