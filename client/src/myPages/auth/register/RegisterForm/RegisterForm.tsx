import React, { useState } from 'react'
import { Alert, Button, Form, Input, Radio, RadioChangeEvent } from 'antd'
import Link from 'next/link'
import { User_Role } from '../../../../graphql'
import { AuthFormStatus, formEmailFieldRules, formPasswordFieldRules } from '../../common/fieldRules'
import { useRegisterPageStore } from '../registerPageStore'
import {
	FieldType,
	FormNames,
	regFormAgainPasswordFieldRules,
	regFormRoleFieldRules,
	useIsNewOrderFormValid,
} from './fn/form'
import { useGetOnSubmit } from './fn/submit'

function RegisterForm() {
	const [form] = Form.useForm()

	const formStatus = useRegisterPageStore((s) => s.formStatus)

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
				disabled={[AuthFormStatus.success, AuthFormStatus.submitPending].includes(formStatus)}
			>
				<RoleRadios />
				<EmailField />
				<PasswordFields />
				<SubmitFormButton />
				<FormWasSentMessage />
				<FormWasNotSentMessage />
			</Form>
		</div>
	)
}

export default RegisterForm

function RoleRadios() {
	const [value, setValue] = useState(1)

	const onChange = (e: RadioChangeEvent) => {
		setValue(e.target.value)
	}

	return (
		<Form.Item<FieldType>
			label='Что хотите делать'
			name={FormNames.role}
			rules={regFormRoleFieldRules}
			initialValue={User_Role.Sender}
		>
			<Radio.Group
				onChange={onChange}
				value={value}
				options={[
					{
						value: User_Role.Sender,
						label: 'Использовать ячейки',
					},
					{
						value: User_Role.Admin,
						label: 'Администрировать шкафы',
					},
				]}
			/>
		</Form.Item>
	)
}

function EmailField() {
	return (
		<Form.Item<FieldType> label='Почта' name={FormNames.email} rules={formEmailFieldRules}>
			<Input autoComplete='email' />
		</Form.Item>
	)
}

function PasswordFields() {
	return (
		<>
			<Form.Item<FieldType> label='Пароль' name={FormNames.password} rules={formPasswordFieldRules}>
				<Input.Password autoComplete='new-password' />
			</Form.Item>

			<Form.Item<FieldType>
				label='Пароль ещё раз'
				name={FormNames.passwordAgain}
				rules={regFormAgainPasswordFieldRules}
			>
				<Input.Password autoComplete='new-password' />
			</Form.Item>
		</>
	)
}

function SubmitFormButton() {
	const isFormValid = useRegisterPageStore((s) => s.isFormValid)
	const formStatus = useRegisterPageStore((s) => s.formStatus)

	return (
		<Form.Item>
			<Button type='primary' htmlType='submit' disabled={!isFormValid || formStatus === AuthFormStatus.success}>
				Зарегистрироваться
			</Button>
		</Form.Item>
	)
}

function FormWasSentMessage() {
	const formStatus = useRegisterPageStore((s) => s.formStatus)
	const emailDomain = useRegisterPageStore((s) => s.registeredEmailDomain)

	if (formStatus !== AuthFormStatus.success) {
		return null
	}

	let message: React.ReactNode = 'Форма успешно отправлена. Проверьте письмо отправленное на указанный адрес.'
	if (emailDomain) {
		message = (
			<p>
				Форма успешно отправлена. Проверьте письмо отправленное на{' '}
				<Link className='link' href={'https://' + emailDomain}>
					{emailDomain}
				</Link>
				.
			</p>
		)
	}

	return (
		<Form.Item>
			<Alert message={message} type='success' />
		</Form.Item>
	)
}

function FormWasNotSentMessage() {
	const formStatus = useRegisterPageStore((s) => s.formStatus)
	const formError = useRegisterPageStore((s) => s.formError)

	if (formStatus !== AuthFormStatus.failure) {
		return null
	}

	return (
		<Form.Item>
			<Alert message={formError} type='error' />
		</Form.Item>
	)
}
