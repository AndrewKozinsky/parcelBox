import dayjs from 'dayjs'
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
		let timeFrom: null | string = dayjs(values.businessTimeFrom).format('HH:mm')
		let timeTo: null | string = dayjs(values.businessTimeTo).format('HH:mm')

		// If the user didn't choose any value time field set the current time.
		// To prevent this behavior I manually set null if the field time is equal to the current time.
		if (timeFrom == dayjs().format('HH:mm')) {
			timeFrom = null
		}
		if (timeTo == dayjs().format('HH:mm')) {
			timeTo = null
		}

		const requestParams = {
			variables: {
				input: {
					parcelBoxTypeId: values.parcelBoxTypeId,
					address: values.address,
					businessDays: values.businessDays,
					businessTimeFrom: timeFrom,
					businessTimeTo: timeTo,
				},
			},
		}

		createBoxRequest(requestParams)
			.then((data) => {
				refetchMyBoxes()
				useAddParcelBoxStore.setState({ formStatus: FormStatus.default, isModalOpen: false })
				form.resetFields()
			})
			.catch((error) => {
				useAddParcelBoxStore.setState({ formStatus: FormStatus.failure, formError: error.message })

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
			})
	}, [])
}
