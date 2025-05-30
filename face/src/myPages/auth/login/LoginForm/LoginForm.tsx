'use client'

import React from 'react'
import { Alert, Button, Form, Input } from 'antd'
import { formFieldRulers, FormStatus } from '../../../common/form'
import { useLoginPageStore } from '../loginPageStore'
import { FieldType, FormNames, LoginFormTest, useGetOnChangeLoginForm } from './fn/form'
import { useGetOnLoginFormSubmit } from './fn/submit'

function LoginForm() {
	const [form] = Form.useForm()

	const formStatus = useLoginPageStore((s) => s.formStatus)

	const onChangeLoginForm = useGetOnChangeLoginForm(form)
	const onLoginFormSubmit = useGetOnLoginFormSubmit(form)

	return (
		<Form
			form={form}
			onChange={onChangeLoginForm}
			onFinish={onLoginFormSubmit}
			autoComplete='on'
			layout='vertical'
			disabled={[FormStatus.success, FormStatus.submitPending].includes(formStatus)}
			data-testid={LoginFormTest.form.id}
		>
			<EmailField />
			<PasswordField />
			<SubmitFormButton />
			<FormWasNotSentMessage />
		</Form>
	)
}

export default LoginForm

function EmailField() {
	return (
		<Form.Item<FieldType> label='Почта' name={FormNames.email} rules={formFieldRulers.email}>
			<Input autoComplete='email' data-testid={LoginFormTest.emailField.id} />
		</Form.Item>
	)
}

function PasswordField() {
	return (
		<>
			<Form.Item<FieldType> label='Пароль' name={FormNames.password} rules={formFieldRulers.password}>
				<Input.Password autoComplete='password' data-testid={LoginFormTest.passwordField.id} />
			</Form.Item>
		</>
	)
}

function SubmitFormButton() {
	const isFormValid = useLoginPageStore((s) => s.isFormValid)
	const formStatus = useLoginPageStore((s) => s.formStatus)

	const isDisabled = !isFormValid || [FormStatus.success, FormStatus.submitPending].includes(formStatus)

	return (
		<Form.Item>
			<Button type='primary' htmlType='submit' disabled={isDisabled} data-testid={LoginFormTest.submitButton.id}>
				Войти
			</Button>
		</Form.Item>
	)
}

function FormWasNotSentMessage() {
	const formStatus = useLoginPageStore((s) => s.formStatus)
	const formError = useLoginPageStore((s) => s.formError)

	if (formStatus !== FormStatus.failure) {
		return null
	}

	return (
		<Form.Item>
			<Alert message={formError} type='error' data-testid={LoginFormTest.failMessage.id} />
		</Form.Item>
	)
}

