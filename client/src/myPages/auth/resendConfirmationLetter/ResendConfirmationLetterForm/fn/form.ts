import { FormInstance } from 'antd'
import { FormStatus } from '../../../common/fieldRules'
import { useResendConfirmationEmailStore } from '../../resendConfirmationLetterPageStore'

export const RCLFormTest = {
	form: { id: 'form', query: 'form[data-testid=form]' },
	emailField: { id: 'email-field', query: 'input[data-testid=email-field]' },
	submitButton: { id: 'submit-button', query: 'button[data-testid=submit-button]' },
	failMessage: { id: 'fail-message', query: '*[data-testid=fail-message]' },
	successMessage: { id: 'success-message', query: '*[data-testid=success-message]' },
}

export type FieldType = {
	[FormNames.email]: string
}
export enum FormNames {
	email = 'email',
}

export function useGetOnChangeResendConfirmationEmailForm(form: FormInstance) {
	return async function () {
		useResendConfirmationEmailStore.setState({ formStatus: FormStatus.default })

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
