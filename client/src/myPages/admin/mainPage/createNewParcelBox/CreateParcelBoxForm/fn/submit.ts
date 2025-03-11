import { useCallback } from 'react'
import { FormInstance } from 'antd'
import { useParcelBoxCreate, useParcelBoxGetMine } from '../../../../../../graphql'
import { FormStatus } from '../../../../../common/form'
import { useAddParcelBoxStore } from '../../addParcelBoxStore'
import { FieldType } from './form'

export function useGetOnCreateBoxFormSubmit(form: FormInstance) {
	const [createBoxRequest] = useParcelBoxCreate({ fetchPolicy: 'no-cache' })
	const { refetch: refetchMyBoxes } = useParcelBoxGetMine()

	return useCallback(async function (values: FieldType) {
		const requestParams = {
			variables: {
				input: {
					parcelBoxTypeId: 1,
					address: values.address,
					businessDays: values.businessDays,
					businessHoursFrom: parseInt(values.fromHour),
					businessHoursTo: parseInt(values.toHour),
				},
			},
		}

		createBoxRequest(requestParams)
			.then((data) => {
				refetchMyBoxes()
				useAddParcelBoxStore.setState({ formStatus: FormStatus.success, isModalOpen: false })
				// afterSuccessfulRequest(data, router)
			})
			.catch((error) => {
				console.log(error)
				// afterFailedRequest(form, error)
			})
	}, [])
}

/*function afterFailedRequest(form: FormInstance, error: any) {
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
}*/
