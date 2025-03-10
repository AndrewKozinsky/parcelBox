import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthConfirmEmail } from '../../../../graphql'
import { routeNames } from '../../../../utils/routeNames'
import { useEmailConfirmationStore } from '../emailConfirmationStore'

export function useConfirmEmail() {
	const router = useRouter()
	const confirmEmailCode = useGetConfirmEmailCode()

	const { loading, error } = useAuthConfirmEmail({
		variables: { input: { code: confirmEmailCode as string } },
		skip: !confirmEmailCode,
		fetchPolicy: 'no-cache',
	})

	useEffect(
		function () {
			if (!confirmEmailCode) {
				useEmailConfirmationStore.setState({
					errorMessage:
						'В адресе не найден код подтверждения почты. Скорее всего вы попали на эту страницу по ошибке.',
				})
				return
			}

			if (loading) {
				useEmailConfirmationStore.setState({
					confirmEmailLoading: true,
				})
				return
			}

			useEmailConfirmationStore.setState({ confirmEmailLoading: false })

			if (error) {
				useEmailConfirmationStore.setState({ errorMessage: error.message })
				return
			}

			// If request was successful redirect to the login page
			setTimeout(() => {
				router.push(routeNames.auth.login.path)
			}, 0)
		},
		[confirmEmailCode, loading, error],
	)
}

function useGetConfirmEmailCode() {
	const searchParams = useSearchParams()
	return searchParams.get('code')
}
