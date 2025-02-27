import { Rule } from 'antd/es/form'

export const formEmailFieldRules: Rule[] = [{ required: true, message: 'Введите электронную почту' }]

export const formPasswordFieldRules: Rule[] = [{ required: true, message: 'Введите пароль', min: 6, max: 30 }]

export enum AuthFormStatus {
	default,
	submitPending,
	success,
	failure,
}
