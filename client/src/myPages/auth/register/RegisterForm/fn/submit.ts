import { FetchResult } from '@apollo/client'
import { useCallback } from 'react'
import { FormInstance } from 'antd'
import {
	AuthRegisterAdmin,
	AuthRegisterSender,
	useAuthRegisterAdmin,
	useAuthRegisterSender,
} from '../../../../../graphql'
import { UserRole } from '../../../../../utils/constants'
import { getEmailDomain } from '../../../../../utils/stringUtils'
import { RegisterFormStatus, useRegisterPageStore } from '../../registerPageStore'
import { FieldType } from './form'

export function useGetOnSubmit(form: FormInstance) {
	const [registerAdmin] = useAuthRegisterAdmin()
	const [registerSender] = useAuthRegisterSender()

	return useCallback(function (values: FieldType) {
		const makeRequest = values.role === UserRole.Admin ? registerAdmin : registerSender

		const requestParams = { variables: { input: { email: values.email, password: values.password } } }

		makeRequest(requestParams)
			.then((data) => {
				afterSuccessfulRequest(data, values)
			})
			.catch((error) => {
				afterFailedRequest(form, error)
			})
	}, [])
}

function afterSuccessfulRequest(
	data: FetchResult<AuthRegisterAdmin> | FetchResult<AuthRegisterSender>,
	values: FieldType,
) {
	useRegisterPageStore.setState({ formStatus: RegisterFormStatus.success })

	const requestName = values.role === UserRole.Admin ? 'auth_registerAdmin' : 'auth_registerSender'

	try {
		// @ts-ignore
		const registeredEmail = data.data[requestName].email
		const registeredEmailDomain = getEmailDomain(registeredEmail)

		if (registeredEmailDomain) {
			useRegisterPageStore.setState({ registeredEmailDomain })
		}
	} catch (err: unknown) {}
}

function afterFailedRequest(form: FormInstance, error: any) {
	useRegisterPageStore.setState({ formStatus: RegisterFormStatus.failure, formError: error.message })

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
