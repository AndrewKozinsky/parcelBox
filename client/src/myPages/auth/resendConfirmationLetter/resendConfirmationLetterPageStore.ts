import { create } from 'zustand'
import { AuthFormStatus } from '../common/fieldRules'

export type ResendConfirmationLetterPageStore = {
	isFormValid: boolean
	formStatus: AuthFormStatus
	emailDomain: null | string
	formError: null | string
}

export const loginPageStoreInitial: ResendConfirmationLetterPageStore = {
	isFormValid: false,
	formStatus: AuthFormStatus.default,
	emailDomain: null,
	formError: null,
}

export const useResendConfirmationEmailStore = create<ResendConfirmationLetterPageStore>()((set) => {
	return loginPageStoreInitial
})
