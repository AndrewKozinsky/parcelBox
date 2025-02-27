import { FormInstance } from 'antd'
import { UserRole } from '../../../../../utils/constants'
import { AuthFormStatus } from '../../../common/fieldRules'
import { useRegisterPageStore } from '../../registerPageStore'
import { Rule } from 'antd/es/form'

export type FieldType = {
	[FormNames.role]: UserRole
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

export function useIsNewOrderFormValid(form: FormInstance) {
	return async function () {
		useRegisterPageStore.setState({ formStatus: AuthFormStatus.default })

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
