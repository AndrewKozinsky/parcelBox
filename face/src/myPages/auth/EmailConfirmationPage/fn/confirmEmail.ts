import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useEffect } from 'react'
import {ApolloClient, useApolloClient} from '@apollo/client'
import { useRouter, useSearchParams } from 'next/navigation'
import {AuthConfirmEmailDocument} from '../../../../graphql'
import { routeNames } from '../../../../utils/routeNames'
import { useEmailConfirmationStore } from '../emailConfirmationStore'

export function useConfirmEmail() {
	const gqiClient = useApolloClient()
	const router = useRouter()
	const confirmEmailCode = useGetConfirmEmailCode()

	useEffect(
		function () {
			if (!confirmEmailCode) {
				const errorMessage = 'В адресе не найден код подтверждения почты. Скорее всего вы попали на эту страницу по ошибке.'
				useEmailConfirmationStore.getState().setErrorMessage(errorMessage)
				return
			}

			useEmailConfirmationStore.getState().setConfirmEmailLoading(true)

			confirmEmail(gqiClient, confirmEmailCode, router)
		},
		[confirmEmailCode],
	)
}

async function confirmEmail(gqiClient: ApolloClient<object>, confirmEmailCode: string | null | undefined, router: AppRouterInstance) {
	try {
		await gqiClient.query({
			query: AuthConfirmEmailDocument,
			fetchPolicy: 'no-cache',
			variables: { input: { code: confirmEmailCode as string } },
		})

		// If request was successful redirect to the login page
		router.push(routeNames.auth.login.path)
	} catch (error: unknown) {
		if (error instanceof Error) {
			useEmailConfirmationStore.getState().setErrorMessage(error.message)
		}
	} finally {
		useEmailConfirmationStore.getState().setConfirmEmailLoading(false)
	}
}

function useGetConfirmEmailCode() {
	const searchParams = useSearchParams()
	return searchParams.get('code')
}
