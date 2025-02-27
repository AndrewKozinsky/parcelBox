import { create } from 'zustand'
import { AuthFormStatus } from '../common/fieldRules'

export type RegisterPageStore = {
	isFormValid: boolean
	formStatus: AuthFormStatus
	registeredEmailDomain: null | string
	formError: null | string
}

export const registerPageStoreInitial: RegisterPageStore = {
	isFormValid: false,
	formStatus: AuthFormStatus.default,
	registeredEmailDomain: null,
	formError: null,
}

export const useRegisterPageStore = create<RegisterPageStore>()((set) => {
	return registerPageStoreInitial
})
