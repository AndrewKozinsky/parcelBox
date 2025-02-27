import { FormInstance } from 'antd'
import { AuthFormStatus } from '../../../common/fieldRules'
import { useLoginPageStore } from '../../loginPageStore'

export type FieldType = {
	[FormNames.email]: string
	[FormNames.password]: string
}
export enum FormNames {
	email = 'email',
	password = 'password',
}

export function useIsNewOrderFormValid(form: FormInstance) {
	return async function () {
		useLoginPageStore.setState({ formStatus: AuthFormStatus.default })

		form.validateFields({ validateOnly: true })
			.then(() => {
				useLoginPageStore.setState({ isFormValid: true })
			})
			.catch((errorData) => {
				if (errorData.errorFields.length) {
					useLoginPageStore.setState({ isFormValid: false })
				}
			})
	}
}
