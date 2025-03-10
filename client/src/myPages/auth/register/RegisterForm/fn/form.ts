import { FormInstance } from 'antd'
import { Rule } from 'antd/es/form'
import { User_Role } from '../../../../../graphql'
import { FormStatus } from '../../../common/fieldRules'
import { useRegisterPageStore } from '../../registerPageStore'

export const RegisterFormTest = {
	form: { id: 'form', query: 'form[data-testid=form]' },
	roleRadio: { id: 'role-radio', query: '*[data-testid=role-radio]' },
	emailField: { id: 'email-field', query: 'input[data-testid=email-field]' },
	passwordField: { id: 'password-field', query: 'input[data-testid=password-field]' },
	passwordAgainField: { id: 'password-again-field', query: 'input[data-testid=password-again-field]' },
	submitButton: { id: 'submit-button', query: 'button[data-testid=submit-button]' },
	failMessage: { id: 'fail-message', query: '*[data-testid=fail-message]' },
	successMessage: { id: 'success-message', query: '*[data-testid=success-message]' },
}

export type FieldType = {
	[FormNames.role]: User_Role
	[FormNames.email]: string
	[FormNames.password]: string
	[FormNames.passwordAgain]: string
}
export enum FormNames {
	role = 'role',
	email = 'email',
	password = 'password',
	passwordAgain = 'passwordAgain',
}

export function useGetOnChangeRegisterForm(form: FormInstance) {
	return async function () {
		useRegisterPageStore.setState({ formStatus: FormStatus.default })

		form.validateFields({ validateOnly: true })
			.then(() => {
				useRegisterPageStore.setState({ isFormValid: true })
			})
			.catch((errorData) => {
				if (errorData.errorFields.length) {
					useRegisterPageStore.setState({ isFormValid: false })
				}
			})
	}
}

export const regFormAgainPasswordFieldRules: Rule[] = [
	{ required: true, message: 'Введите пароль ещё раз' },
	({ getFieldValue }) => ({
		validator(_, value) {
			if (!value || getFieldValue(FormNames.password) === value) {
				return Promise.resolve()
			}
			return Promise.reject(new Error('Пароли не сходятся'))
		},
	}),
]

export const regFormRoleFieldRules: Rule[] = [{ required: true, message: 'Выберите что будите делать' }]
