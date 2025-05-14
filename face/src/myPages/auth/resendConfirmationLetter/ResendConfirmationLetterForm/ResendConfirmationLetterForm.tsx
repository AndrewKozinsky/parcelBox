import React from 'react'
import Link from 'next/link'
import { Alert, Button, Form, Input } from 'antd'
import { formFieldRulers, FormStatus } from '../../../common/form'
import { useResendConfirmationEmailStore } from '../resendConfirmationLetterPageStore'
import { FieldType, FormNames, RCLFormTest, useGetOnChangeResendConfirmationEmailForm } from './fn/form'
import { useGetOnSubmit } from './fn/submit'

function ResendConfirmationLetterForm() {
	const [form] = Form.useForm()

	const formStatus = useResendConfirmationEmailStore((s) => s.formStatus)

	const onChangeResendConfEmailForm = useGetOnChangeResendConfirmationEmailForm(form)
	const onSubmit = useGetOnSubmit(form)

	return (
		<div>
			<Form
				form={form}
				onChange={onChangeResendConfEmailForm}
				onFinish={onSubmit}
				autoComplete='on'
				layout='vertical'
				disabled={[FormStatus.success, FormStatus.submitPending].includes(formStatus)}
				data-testid={RCLFormTest.form.id}
			>
				<EmailField />
				<SubmitFormButton />
				<FormWasSentMessage />
				<FormWasNotSentMessage />
			</Form>
		</div>
	)
}

export default ResendConfirmationLetterForm

function EmailField() {
	return (
		<Form.Item<FieldType> label='Почта' name={FormNames.email} rules={formFieldRulers.email}>
			<Input autoComplete='email' data-testid={RCLFormTest.emailField.id} />
		</Form.Item>
	)
}

function SubmitFormButton() {
	const isFormValid = useResendConfirmationEmailStore((s) => s.isFormValid)
	const formStatus = useResendConfirmationEmailStore((s) => s.formStatus)

	const isDisabled = !isFormValid || [FormStatus.success, FormStatus.submitPending].includes(formStatus)

	return (
		<Form.Item>
			<Button type='primary' htmlType='submit' disabled={isDisabled} data-testid={RCLFormTest.submitButton.id}>
				Отправить письмо
			</Button>
		</Form.Item>
	)
}

function FormWasSentMessage() {
	const formStatus = useResendConfirmationEmailStore((s) => s.formStatus)
	const emailDomain = useResendConfirmationEmailStore((s) => s.emailDomain)

	if (formStatus !== FormStatus.success) {
		return null
	}

	let message: React.ReactNode = 'Письмо отправлено.'
	if (emailDomain) {
		message = (
			<p>
				Письмо отправлено. Проверьте на{' '}
				<Link className='link' href={'https://' + emailDomain} target='_blank'>
					{emailDomain}
				</Link>
				.
			</p>
		)
	}

	return (
		<Form.Item>
			<Alert message={message} type='success' data-testid={RCLFormTest.successMessage.id} />
		</Form.Item>
	)
}

function FormWasNotSentMessage() {
	const formStatus = useResendConfirmationEmailStore((s) => s.formStatus)
	const formError = useResendConfirmationEmailStore((s) => s.formError)

	if (formStatus !== FormStatus.failure) {
		return null
	}

	return (
		<Form.Item>
			<Alert message={formError} type='error' data-testid={RCLFormTest.failMessage.id} />
		</Form.Item>
	)
}
