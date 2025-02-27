import React from 'react'
import { Alert, Button, Form, Input } from 'antd'
import { AuthFormStatus, formEmailFieldRules, formPasswordFieldRules } from '../../common/fieldRules'
import { useLoginPageStore } from '../loginPageStore'
import { FieldType, FormNames, useIsNewOrderFormValid } from './fn/form'
import { useGetOnSubmit } from './fn/submit'

function LoginForm() {
	const [form] = Form.useForm()

	const formStatus = useLoginPageStore((s) => s.formStatus)

	const failedSubmitNewOrderForm = useIsNewOrderFormValid(form)
	const onSubmit = useGetOnSubmit(form)

	return (
		<div>
			<Form
				form={form}
				onChange={failedSubmitNewOrderForm}
				onFinish={onSubmit}
				autoComplete='on'
				layout='vertical'
				disabled={formStatus === AuthFormStatus.success}
			>
				<EmailField />
				<PasswordField />
				<SubmitFormButton />
				<FormWasNotSentMessage />
			</Form>
		</div>
	)
}

export default LoginForm

function EmailField() {
	return (
		<Form.Item<FieldType> label='Почта' name={FormNames.email} rules={formEmailFieldRules}>
			<Input autoComplete='email' />
		</Form.Item>
	)
}

function PasswordField() {
	return (
		<>
			<Form.Item<FieldType> label='Пароль' name={FormNames.password} rules={formPasswordFieldRules}>
				<Input.Password autoComplete='password' />
			</Form.Item>
		</>
	)
}

function SubmitFormButton() {
	const isFormValid = useLoginPageStore((s) => s.isFormValid)
	const formStatus = useLoginPageStore((s) => s.formStatus)

	return (
		<Form.Item>
			<Button type='primary' htmlType='submit' disabled={!isFormValid || formStatus === AuthFormStatus.success}>
				Войти
			</Button>
		</Form.Item>
	)
}

function FormWasNotSentMessage() {
	const formStatus = useLoginPageStore((s) => s.formStatus)
	const formError = useLoginPageStore((s) => s.formError)

	if (formStatus !== AuthFormStatus.failure) {
		return null
	}

	return (
		<Form.Item>
			<Alert message={formError} type='error' />
		</Form.Item>
	)
}
