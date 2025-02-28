import { FormInstance } from 'antd'
import { AuthFormStatus } from '../../../common/fieldRules'
import { useResendConfirmationEmailStore } from '../../resendConfirmationLetterPageStore'

export type FieldType = {
	[FormNames.email]: string
}
export enum FormNames {
	email = 'email',
}

export function useGetOnChangeResendConfirmationEmailForm(form: FormInstance) {
	return async function () {
		useResendConfirmationEmailStore.setState({ formStatus: AuthFormStatus.default })

		form.validateFields({ validateOnly: true })
			.then(() => {
				useResendConfirmationEmailStore.setState({ isFormValid: true })
			})
			.catch((errorData) => {
				if (errorData.errorFields.length) {
					useResendConfirmationEmailStore.setState({ isFormValid: false })
				}
			})
	}
}
