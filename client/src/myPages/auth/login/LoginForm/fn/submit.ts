import { FetchResult } from '@apollo/client'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { FormInstance } from 'antd'
import { useUserStore } from '../../../../../stores/userStore'
import { routeNames } from '../../../../../utils/routeNames'
import { AuthFormStatus } from '../../../common/fieldRules'
import { useLoginPageStore } from '../../loginPageStore'
import { FieldType } from './form'
import { AuthLogin, useAuthLogin } from '@/graphql'

export function useGetOnSubmit(form: FormInstance) {
	const router = useRouter()
	const [loginRequest] = useAuthLogin()

	return useCallback(function (values: FieldType) {
		const requestParams = { variables: { input: { email: values.email, password: values.password } } }

		loginRequest(requestParams)
			.then((data) => {
				afterSuccessfulRequest(data, router)
			})
			.catch((error) => {
				afterFailedRequest(form, error)
			})
	}, [])
}

function afterSuccessfulRequest(data: FetchResult<AuthLogin>, router: AppRouterInstance) {
	useLoginPageStore.setState({ formStatus: AuthFormStatus.success })

	try {
		// Set data to the UserStore
		useUserStore.setState({ user: null, isLoading: false, isError: false })

		// Redirect to the main page
		router.push(routeNames.main.path)
	} catch (err: unknown) {}
}

function afterFailedRequest(form: FormInstance, error: any) {
	useLoginPageStore.setState({ formStatus: AuthFormStatus.failure, formError: error.message })

	try {
		// Get fields errors from server
		const errorFields: Record<string, string>[] = error.graphQLErrors[0].fields // {password: ['Minimum number of characters is 6']}

		// Create an array to show errors under appropriated form fields
		const formattedErrors = Object.entries(errorFields).map(([field, errors]) => {
			return {
				name: field,
				// @ts-ignore
				errors: errorFields[field], // Ant Design expects an array of error messages
			}
		})

		form.setFields(formattedErrors)
	} catch (err: unknown) {}
}
