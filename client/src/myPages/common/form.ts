import { Rule } from 'antd/es/form'

export const formFieldRulers = {
	email: [{ required: true, message: 'Введите электронную почту', type: 'email' }],
	password: [{ required: true, message: 'Введите пароль', min: 6, max: 30 }],
} satisfies Record<string, Rule[]>

export enum FormStatus {
	default,
	submitPending,
	success,
	failure,
}
