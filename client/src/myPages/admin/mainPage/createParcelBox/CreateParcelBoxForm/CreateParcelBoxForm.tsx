import React from 'react'
import { Button, Checkbox, Form, Space, Alert, Radio, Typography, TimePicker, AutoComplete, FormInstance } from 'antd'
import { useParcelBoxTypeGetAll } from '../../../../../graphql'
import { formFieldRulers, FormStatus } from '../../../../common/form'
import { useAddParcelBoxStore } from '../addParcelBoxStore'
import { checkAllWorkFieldDaysOptions, useGetCheckAllWorkDaysBoxes } from './fn/businessDaysField'
import { useGetOnAddressFieldSearch } from './fn/addressFields'
import { AddParcelBoxFormTest, FieldType, FormNames, useGetOnChangeCreateBoxForm } from './fn/form'
import { convertCellTypeToSummary } from './fn/parcelBoxField'
import { useGetOnCreateBoxFormSubmit } from './fn/submit'
import { useGetSetZerosToWorkTimeInput } from './fn/workTimeField'
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
			<BusinessDaysCheckboxes form={form} />
			<WorkTimeFields form={form} />
			<ParcelBoxTypeRadios />
			<SubmitFormButton />
			<FormWasNotSentMessage />
		</Form>
	)
}

export default CreateParcelBoxForm

function AddressField() {
	const addressSuggestions = useAddParcelBoxStore((s) => s.addressSuggestions)
	const onAddressFieldSearch = useGetOnAddressFieldSearch()

	return (
		<Form.Item<FieldType> label='Адрес:' name={FormNames.address} rules={formFieldRulers.address}>
			<AutoComplete options={addressSuggestions} onSearch={onAddressFieldSearch} />
		</Form.Item>
	)
}

type BusinessDaysCheckboxesProps = {
	form: FormInstance<FieldType>
}

function BusinessDaysCheckboxes(props: BusinessDaysCheckboxesProps) {
	const { form } = props

	const checkAllWorkDaysBoxes = useGetCheckAllWorkDaysBoxes(form)

	return (
		<Space>
			<Form.Item<FieldType> label='Дни работы:' name={FormNames.businessDays}>
				<Checkbox.Group options={checkAllWorkFieldDaysOptions} />
			</Form.Item>
			<Button size='small' onClick={checkAllWorkDaysBoxes}>
				Каждый день
			</Button>
		</Space>
	)
}

type WorkTimeFieldsProps = {
	form: FormInstance<FieldType>
}

function WorkTimeFields(props: WorkTimeFieldsProps) {
	const { form } = props

	const format = 'HH:mm'
	const setZerosToWorkTimeInput = useGetSetZerosToWorkTimeInput(form)

	return (
		<div className='create-parcel-box-form__work-time-wrapper'>
			<Form.Item<FieldType> name={FormNames.businessTime} label='Часы работы:'>
				<TimePicker.RangePicker
					format={format}
					minuteStep={10}
					needConfirm={false}
					showNow={false}
					data-testid={AddParcelBoxFormTest.businessTime.id}
				/>
			</Form.Item>
			<Button className='create-parcel-box-form__work-time-day-and-night-btn' onClick={setZerosToWorkTimeInput}>
				Круглосуточно
			</Button>
		</div>
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
