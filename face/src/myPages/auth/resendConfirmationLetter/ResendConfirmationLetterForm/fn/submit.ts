// import { useCallback } from 'react'
// import { useRouter } from 'next/navigation'
// import { FormInstance } from 'antd'
// import { getEmailDomain } from '../../../../../utils/stringUtils'
// import { FormStatus } from '../../../../common/form'
// import { useResendConfirmationEmailStore } from '../../resendConfirmationLetterPageStore'
// import { FieldType, FormNames } from './form'
// import { useAuthResendConfirmationEmail } from '@/graphql'

/*export function useGetOnSubmit(form: FormInstance) {
	const router = useRouter()
	const [resendConfirmationEmailRequest] = useAuthResendConfirmationEmail({ fetchPolicy: 'no-cache' })

	return useCallback(function (values: FieldType) {
		const requestParams = { variables: { input: { email: values.email } } }

		resendConfirmationEmailRequest(requestParams)
			.then((data) => {
				afterSuccessfulRequest(values)
			})
			.catch((error) => {
				afterFailedRequest(form, error)
			})
	}, [])
}*/

/*function afterSuccessfulRequest(values: FieldType) {
	useResendConfirmationEmailStore.setState({ formStatus: FormStatus.success })

	try {
		const emailDomain = getEmailDomain(values[FormNames.email])

		if (emailDomain) {
			useResendConfirmationEmailStore.setState({ emailDomain })
		}
	} catch (err: unknown) {
		console.log(err)
	}
}*/

/*function afterFailedRequest(form: FormInstance, error: any) {
	useResendConfirmationEmailStore.setState({ formStatus: FormStatus.failure, formError: error.message })

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
	} catch (err: unknown) {
		console.log(err)
	}
}*/
