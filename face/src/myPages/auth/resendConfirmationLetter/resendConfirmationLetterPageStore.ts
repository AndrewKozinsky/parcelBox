import { create } from 'zustand'
import { FormStatus } from '../../common/form'

export type ResendConfirmationLetterPageStore = {
	isFormValid: boolean
	formStatus: FormStatus
	emailDomain: null | string
	formError: null | string
}

export const loginPageStoreInitial: ResendConfirmationLetterPageStore = {
	isFormValid: false,
	formStatus: FormStatus.default,
	emailDomain: null,
	formError: null,
}

export const useResendConfirmationEmailStore = create<ResendConfirmationLetterPageStore>()((set) => {
	return loginPageStoreInitial
})
