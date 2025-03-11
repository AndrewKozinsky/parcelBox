import { FormInstance } from 'antd'
import { FormStatus } from '../../../../../common/form'
import { useAddParcelBoxStore } from '../../addParcelBoxStore'

export const AddParcelBoxFormTest = {
	form: { id: 'form', query: 'form[data-testid=form]' },
	addressField: { id: 'address-field', query: 'input[data-testid=address-field]' },
	businessHoursFrom: { id: 'from-hour-field', query: 'input[data-testid=from-hour-field]' },
	businessHoursTo: { id: 'to-hour-field', query: 'input[data-testid=to-hour-field]' },
	parcelBoxTypeId: { id: 'parcel-box-type-id', query: 'input[data-testid=parcel-box-type-id]' },
	submitButton: { id: 'submit-button', query: 'button[data-testid=submit-button]' },
	failMessage: { id: 'fail-message', query: '*[data-testid=fail-message]' },
}

export type FieldType = {
	[FormNames.address]: string
	[FormNames.businessDays]: number[]
	[FormNames.businessHoursFrom]: string
	[FormNames.businessHoursTo]: string
	[FormNames.parcelBoxTypeId]: number
}
export enum FormNames {
	address = 'address',
	businessDays = 'businessDays',
	businessHoursFrom = 'businessHoursFrom',
	businessHoursTo = 'businessHoursTo',
	parcelBoxTypeId = 'parcelBoxTypeId',
}

export function useGetOnChangeCreateBoxForm(form: FormInstance) {
	return async function () {
		useAddParcelBoxStore.setState({ formStatus: FormStatus.default })

		form.validateFields({ validateOnly: true })
			.then(() => {
				useAddParcelBoxStore.setState({ isFormValid: true })
			})
			.catch((errorData) => {
				if (errorData.errorFields.length) {
					useAddParcelBoxStore.setState({ isFormValid: false })
				}
			})
	}
}
