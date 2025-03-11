import { FormStatus } from '@/myPages/auth/common/fieldRules'
import { FormInstance } from 'antd'
import { useAddParcelBoxStore } from '../../addParcelBoxStore'

export const AddParcelBoxFormTest = {
	form: { id: 'form', query: 'form[data-testid=form]' },
	addressField: { id: 'email-field', query: 'input[data-testid=email-field]' },
	fromHour: { id: 'from-hour-field', query: 'input[data-testid=from-hour-field]' },
	toHour: { id: 'to-hour-field', query: 'input[data-testid=to-hour-field]' },
	submitButton: { id: 'submit-button', query: 'button[data-testid=submit-button]' },
	// failMessage: { id: 'fail-message', query: '*[data-testid=fail-message]' },
}

export type FieldType = {
	[FormNames.address]: string
	[FormNames.businessDays]: number[]
	[FormNames.fromHour]: string
	[FormNames.toHour]: string
}
export enum FormNames {
	address = 'address',
	businessDays = 'businessDays',
	fromHour = 'fromHour',
	toHour = 'toHour',
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
