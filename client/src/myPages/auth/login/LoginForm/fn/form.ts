import { FormInstance } from 'antd'
import { FormStatus } from '../../../common/fieldRules'
import { useLoginPageStore } from '../../loginPageStore'

export const LoginFormTest = {
	form: { id: 'form', query: 'form[data-testid=form]' },
	emailField: { id: 'email-field', query: 'input[data-testid=email-field]' },
	passwordField: { id: 'password-field', query: 'input[data-testid=password-field]' },
	submitButton: { id: 'submit-button', query: 'button[data-testid=submit-button]' },
	failMessage: { id: 'fail-message', query: '*[data-testid=fail-message]' },
}

export type FieldType = {
	[FormNames.email]: string
	[FormNames.password]: string
}
export enum FormNames {
	email = 'email',
	password = 'password',
}

export function useGetOnChangeLoginForm(form: FormInstance) {
	return async function () {
		useLoginPageStore.setState({ formStatus: FormStatus.default })

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
