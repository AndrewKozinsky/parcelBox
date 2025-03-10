import { create } from 'zustand'
import { FormStatus } from '../common/fieldRules'

export type RegisterPageStore = {
	isFormValid: boolean
	formStatus: FormStatus
	registeredEmailDomain: null | string
	formError: null | string
}

export const registerPageStoreInitial: RegisterPageStore = {
	isFormValid: false,
	formStatus: FormStatus.default,
	registeredEmailDomain: null,
	formError: null,
}

export const useRegisterPageStore = create<RegisterPageStore>()((set) => {
	return registerPageStoreInitial
})
