import React from 'react'
import { Alert, Button, Checkbox, Form, Input, Space } from 'antd'
import { FormStatus } from '../../../../auth/common/fieldRules'
import { addParcelBoxStoreInitial, useAddParcelBoxStore } from '../addParcelBoxStore'
import { AddParcelBoxFormTest, FieldType, FormNames, useGetOnChangeCreateBoxForm } from './fn/form'
import { useGetOnCreateBoxFormSubmit } from './fn/submit'

function CreateParcelBoxForm() {
	const [form] = Form.useForm()

	// const formStatus = useLoginPageStore((s) => s.formStatus)

	const onChangeLoginForm = useGetOnChangeCreateBoxForm(form)
	const onFormSubmit = useGetOnCreateBoxFormSubmit(form)

	return (
		<Form
			form={form}
			onChange={onChangeLoginForm}
			onFinish={onFormSubmit}
			autoComplete='on'
			layout='vertical'
			// disabled={[AuthFormStatus.success, AuthFormStatus.submitPending].includes(formStatus)}
			data-testid={AddParcelBoxFormTest.form.id}
		>
			<AddressField />
			<BusinessDaysCheckboxes />
			<WorkHoursFields />
			<SubmitFormButton />
			{/*<FormWasNotSentMessage />*/}
		</Form>
	)
}

export default CreateParcelBoxForm

function AddressField() {
	return (
		<Form.Item<FieldType> label='Адрес' name={FormNames.address}>
			<Input data-testid={AddParcelBoxFormTest.addressField.id} />
		</Form.Item>
	)
}

function BusinessDaysCheckboxes() {
	const options = [
		{ label: 'Пн.', value: 1 },
		{ label: 'Вт.', value: 2 },
		{ label: 'Ср.', value: 3 },
		{ label: 'Чт.', value: 4 },
		{ label: 'Пт.', value: 5 },
		{ label: 'Сб.', value: 6 },
		{ label: 'Вс.', value: 7 },
	]

	return (
		<Form.Item<FieldType> label='Дни работы помещения' name={FormNames.businessDays}>
			<Checkbox.Group options={options} />
		</Form.Item>
	)
}

function WorkHoursFields() {
	return (
		<Space>
			<Form.Item<FieldType> label='Часы работы помещения' name={FormNames.fromHour}>
				<Input data-testid={AddParcelBoxFormTest.addressField.id} type='number' />
			</Form.Item>
			<Form.Item<FieldType> label=' ' name={FormNames.toHour}>
				<Input data-testid={AddParcelBoxFormTest.addressField.id} type='number' />
			</Form.Item>
		</Space>
	)
}

function SubmitFormButton() {
	const isFormValid = useAddParcelBoxStore((s) => s.isFormValid)
	const formStatus = useAddParcelBoxStore((s) => s.formStatus)

	const isDisabled = !isFormValid || [FormStatus.success, FormStatus.submitPending].includes(formStatus)

	return (
		<Form.Item>
			<Button
				type='primary'
				htmlType='submit'
				disabled={isDisabled}
				data-testid={AddParcelBoxFormTest.submitButton.id}
			>
				Создать
			</Button>
		</Form.Item>
	)
}

/*function FormWasNotSentMessage() {
	const formStatus = addParcelBoxStoreInitial((s) => s.formStatus)
	const formError = addParcelBoxStoreInitial((s) => s.formError)

	if (formStatus !== AuthFormStatus.failure) {
		return null
	}

	return (
		<Form.Item>
			<Alert message={formError} type='error' data-testid={AddParcelBoxFormTest.failMessage.id} />
		</Form.Item>
	)
}*/
