import { create } from 'zustand'
import { AuthFormStatus } from '../common/fieldRules'

export type LoginPageStore = {
	isFormValid: boolean
	formStatus: AuthFormStatus
	formError: null | string
}

export const loginPageStoreInitial: LoginPageStore = {
	isFormValid: false,
	formStatus: AuthFormStatus.default,
	formError: null,
}

export const useLoginPageStore = create<LoginPageStore>()((set) => {
	return loginPageStoreInitial
})
