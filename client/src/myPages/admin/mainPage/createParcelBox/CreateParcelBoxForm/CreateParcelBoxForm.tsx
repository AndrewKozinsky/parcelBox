import React from 'react'
import { Button, Checkbox, Form, Input, Space, InputNumber, Alert } from 'antd'
import { formFieldRulers, FormStatus } from '../../../../common/form'
import { useAddParcelBoxStore } from '../addParcelBoxStore'
import { AddParcelBoxFormTest, FieldType, FormNames, useGetOnChangeCreateBoxForm } from './fn/form'
import { useGetOnCreateBoxFormSubmit } from './fn/submit'

function CreateParcelBoxForm() {
	const [form] = Form.useForm()

	const formStatus = useAddParcelBoxStore((s) => s.formStatus)

	const onChangeLoginForm = useGetOnChangeCreateBoxForm(form)
	const onFormSubmit = useGetOnCreateBoxFormSubmit(form)

	return (
		<Form
			form={form}
			onChange={onChangeLoginForm}
			onFinish={onFormSubmit}
			autoComplete='on'
			layout='vertical'
			disabled={[FormStatus.success, FormStatus.submitPending].includes(formStatus)}
			data-testid={AddParcelBoxFormTest.form.id}
		>
			<AddressField />
			<BusinessDaysCheckboxes />
			<WorkHoursFields />
			<SubmitFormButton />
			<FormWasNotSentMessage />
		</Form>
	)
}

export default CreateParcelBoxForm

function AddressField() {
	return (
		<Form.Item<FieldType> label='Адрес:' name={FormNames.address} rules={formFieldRulers.address}>
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
		<Form.Item<FieldType> label='Дни работы:' name={FormNames.businessDays}>
			<Checkbox.Group options={options} />
		</Form.Item>
	)
}

function WorkHoursFields() {
	return (
		<Form.Item label='Часы работы:'>
			<Space>
				<Form.Item<FieldType> name={FormNames.businessHoursFrom} style={{ margin: 0 }}>
					<InputNumber data-testid={AddParcelBoxFormTest.businessHoursFrom.id} min={1} max={24} />
				</Form.Item>
				<Form.Item<FieldType> name={FormNames.businessHoursTo} style={{ margin: 0 }}>
					<InputNumber data-testid={AddParcelBoxFormTest.businessHoursTo.id} min={1} max={24} />
				</Form.Item>
			</Space>
		</Form.Item>
	)
}

function SubmitFormButton() {
	const isFormValid = useAddParcelBoxStore((s) => s.isFormValid)
	const formStatus = useAddParcelBoxStore((s) => s.formStatus)

	const isDisabled = !isFormValid || [FormStatus.success, FormStatus.submitPending].includes(formStatus)

	return (
		<Button
			type='primary'
			htmlType='submit'
			disabled={isDisabled}
			data-testid={AddParcelBoxFormTest.submitButton.id}
		>
			Создать
		</Button>
	)
}

function FormWasNotSentMessage() {
	const formStatus = useAddParcelBoxStore((s) => s.formStatus)
	const formError = useAddParcelBoxStore((s) => s.formError)

	if (formStatus !== FormStatus.failure) {
		return null
	}

	return (
		<Alert
			message={formError}
			type='error'
			data-testid={AddParcelBoxFormTest.failMessage.id}
			style={{ marginTop: '2rem' }}
		/>
	)
}
