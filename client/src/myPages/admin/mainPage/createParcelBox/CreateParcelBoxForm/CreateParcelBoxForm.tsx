import React from 'react'
import { Button, Checkbox, Form, Input, Space, InputNumber, Alert, Radio, Typography, TimePicker } from 'antd'
import { useParcelBoxTypeGetAll } from '../../../../../graphql'
import { formFieldRulers, FormStatus } from '../../../../common/form'
import { useAddParcelBoxStore } from '../addParcelBoxStore'
import { convertCellTypeToSummary } from './fn/fields'
import { AddParcelBoxFormTest, FieldType, FormNames, useGetOnChangeCreateBoxForm } from './fn/form'
import { useGetOnCreateBoxFormSubmit } from './fn/submit'
import './CreateParcelBoxForm.scss'

const { Text } = Typography

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
			<WorkTimeFields />
			<ParcelBoxTypeRadios />
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

function WorkTimeFields() {
	const format = 'HH:mm'

	return (
		<Form.Item label='Часы работы:'>
			<Space>
				<Form.Item<FieldType> name={FormNames.businessTimeFrom} style={{ margin: 0 }}>
					<TimePicker
						format={format}
						minuteStep={10}
						needConfirm={false}
						placeholder='Время начала'
						showNow={false}
						data-testid={AddParcelBoxFormTest.businessTimeFrom.id}
					/>
				</Form.Item>
				<Form.Item<FieldType> name={FormNames.businessTimeTo} style={{ margin: 0 }}>
					<TimePicker
						format={format}
						minuteStep={10}
						needConfirm={false}
						placeholder='Время конца'
						showNow={false}
						data-testid={AddParcelBoxFormTest.businessTimeTo.id}
					/>
				</Form.Item>
			</Space>
		</Form.Item>
	)
}

function ParcelBoxTypeRadios() {
	const { loading, data, error } = useParcelBoxTypeGetAll()

	if (loading) return null
	if (error) return <Text>При загрузке типов посыльных ящиков произошла ошибка.</Text>
	if (!data) return null

	return (
		<Form.Item<FieldType>
			label='Тип ящика:'
			name={FormNames.parcelBoxTypeId}
			rules={[{ required: true, message: 'Укажите тип ящика' }]}
		>
			<Radio.Group data-testid={AddParcelBoxFormTest.parcelBoxTypeId.id}>
				{data.parcelBoxType_getAll.map((boxType) => {
					const cellSizesSummary = convertCellTypeToSummary(boxType.cellTypes)

					return (
						<React.Fragment key={boxType.id}>
							<Radio value={boxType.id}>{boxType.name}</Radio>
							<div className='create-parcel-box-form__type-cell-summary'>
								<img
									src={`/parcelBoxTypes/${boxType.name}.svg`}
									className='create-parcel-box-form__type-cell-pic'
									alt={boxType.name}
								/>

								{cellSizesSummary.map((itemStr, i) => {
									return (
										<p key={i}>
											<Text>{itemStr}</Text>
										</p>
									)
								})}
							</div>
						</React.Fragment>
					)
				})}
			</Radio.Group>
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
