import { FetchResult } from '@apollo/client'
import {AppRouterInstance} from 'next/dist/shared/lib/app-router-context.shared-runtime'
import {useRouter} from 'next/navigation'
import { useCallback } from 'react'
import { FormInstance } from 'antd'
import {
	AuthRegisterAdmin,
	AuthRegisterSender,
	useAuthRegisterAdmin,
	useAuthRegisterSender,
	User_Role,
} from '../../../../../graphql'
import {routeNames} from '../../../../../utils/routeNames'
import { getEmailDomain } from '../../../../../utils/stringUtils'
import { FormStatus } from '../../../../common/form'
import { useRegisterPageStore } from '../../registerPageStore'
import { FieldType } from './form'

export function useGetOnSubmit(form: FormInstance) {
	const router = useRouter()
	const [registerAdmin] = useAuthRegisterAdmin({ fetchPolicy: 'no-cache' })
	const [registerSender] = useAuthRegisterSender({ fetchPolicy: 'no-cache' })

	return useCallback(function (values: FieldType) {
		const makeRequest = values.role === User_Role.Admin ? registerAdmin : registerSender

		const requestParams = { variables: { input: { email: values.email, password: values.password } } }

		makeRequest(requestParams)
			.then((data) => {
				afterSuccessfulRequest(data, values, router)
			})
			.catch((error) => {
				afterFailedRequest(form, error)
			})
	}, [])
}

function afterSuccessfulRequest(
	data: FetchResult<AuthRegisterAdmin> | FetchResult<AuthRegisterSender>,
	values: FieldType,
	router: AppRouterInstance
) {
	useRegisterPageStore.setState({ formStatus: FormStatus.success })

	const requestName = values.role === User_Role.Admin ? 'auth_registerAdmin' : 'auth_registerSender'

	try {
		// @ts-ignore
		const registeredEmail = data.data[requestName].email
		const registeredEmailDomain = getEmailDomain(registeredEmail)

		if (registeredEmailDomain) {
			useRegisterPageStore.setState({ registeredEmailDomain })
		}

		router.push(routeNames.auth.login.path)
	} catch (err: unknown) {}
}

function afterFailedRequest(form: FormInstance, error: any) {
	useRegisterPageStore.setState({ formStatus: FormStatus.failure, formError: error.message })

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
