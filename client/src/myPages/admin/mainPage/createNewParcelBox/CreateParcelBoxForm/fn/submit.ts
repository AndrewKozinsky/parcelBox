import { useCallback } from 'react'
// import { AdminOutModel, AuthLogin, SenderOutModel, useAuthLogin, User_Role } from '@/graphql'
// import { FetchResult } from '@apollo/client'
import { FormInstance } from 'antd'
import { useParcelBoxCreate, useParcelBoxGetMine } from '../../../../../../graphql'
import { useUserStore } from '../../../../../../stores/userStore'
import { FormStatus } from '../../../../../auth/common/fieldRules'
import { useAddParcelBoxStore } from '../../addParcelBoxStore'
// import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
// import { useRouter } from 'next/navigation'
// import { useUserStore } from '../../../../../stores/userStore'
// import { routeNames } from '../../../../../utils/routeNames'
// import { AuthFormStatus } from '../../../common/fieldRules'
import { FieldType } from './form'

export function useGetOnCreateBoxFormSubmit(form: FormInstance) {
	const adminUser = useUserStore((s) => s.adminUser)

	const [createBoxRequest] = useParcelBoxCreate({ fetchPolicy: 'no-cache' })
	const { refetch: refetchMyBoxes } = useParcelBoxGetMine()

	return useCallback(async function (values: FieldType) {
		const requestParams = { variables: { input: { userId: adminUser!.id, parcelBoxTypeId: 1 } } }

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
