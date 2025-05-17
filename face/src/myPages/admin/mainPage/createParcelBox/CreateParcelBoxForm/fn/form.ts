// import { FormInstance } from 'antd'
// import dayjs from 'dayjs'
// import { FormStatus } from '../../../../../common/form'
// import { useAddParcelBoxStore } from '../../addParcelBoxStore'

/*export const AddParcelBoxFormTest = {
	form: { id: 'form', query: 'form[data-testid=form]' },
	addressField: { id: 'address-field', query: 'input[data-testid=address-field]' },
	businessTime: { id: 'time-field', query: 'input[data-testid=time-field]' },
	parcelBoxTypeId: { id: 'parcel-box-type-id', query: 'input[data-testid=parcel-box-type-id]' },
	submitButton: { id: 'submit-button', query: 'button[data-testid=submit-button]' },
	failMessage: { id: 'fail-message', query: '*[data-testid=fail-message]' },
}*/

/*export type FieldType = {
	[FormNames.address]: string
	[FormNames.businessDays]: number[]
	[FormNames.businessTime]: [dayjs.Dayjs, dayjs.Dayjs]
	[FormNames.parcelBoxTypeId]: number
}*/
/*export enum FormNames {
	address = 'address',
	businessDays = 'businessDays',
	businessTime = 'businessTime',
	parcelBoxTypeId = 'parcelBoxTypeId',
}*/

/*export function useGetOnChangeCreateBoxForm(form: FormInstance) {
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
}*/
