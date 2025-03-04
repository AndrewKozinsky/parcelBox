import { useCallback } from 'react'
import {
	AdminOutModel,
	AuthGetMeDocument,
	AuthLogin,
	AuthLoginDocument,
	SenderOutModel,
	useAuthLogin,
	User_Role,
} from '@/graphql'
import { FetchResult } from '@apollo/client'
import { FormInstance } from 'antd'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { useRouter } from 'next/navigation'
import { useUserStore } from '../../../../../stores/userStore'
import { routeNames } from '../../../../../utils/routeNames'
import { AuthFormStatus } from '../../../common/fieldRules'
import { useLoginPageStore } from '../../loginPageStore'
import { FieldType } from './form'

export function useGetOnLoginFormSubmit(form: FormInstance) {
	const router = useRouter()
	const [loginRequest] = useAuthLogin({ fetchPolicy: 'no-cache' })

	return useCallback(async function (values: FieldType) {
		const requestParams = { variables: { input: { email: values.email, password: values.password } } }

		loginRequest(requestParams)
			.then((data) => {
				console.log(data)
				afterSuccessfulRequest(data, router)
			})
			.catch((error) => {
				console.log(error)
				afterFailedRequest(form, error)
			})
	}, [])
}

function afterSuccessfulRequest(data: FetchResult<AuthLogin>, router: AppRouterInstance) {
	useLoginPageStore.setState({ formStatus: AuthFormStatus.success })

	useUserStore.setState({
		isLoading: false,
	})

	try {
		if (!data.data) return
		const userData = data.data.auth_login

		// Set data to the UserStore
		if (userData.role === User_Role.Admin) {
			useUserStore.getState().setAdminUser(userData as AdminOutModel)
		} else if (userData.role === User_Role.Sender) {
			useUserStore.getState().setSenderUser(userData as SenderOutModel)
		}

		// Clear form blocking
		useLoginPageStore.setState({ formStatus: AuthFormStatus.default })

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
