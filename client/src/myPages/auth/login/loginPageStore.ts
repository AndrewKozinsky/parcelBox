import { create } from 'zustand'
import { FormStatus } from '../../common/form'

export type LoginPageStore = {
	isFormValid: boolean
	formStatus: FormStatus
	formError: null | string
}

export const loginPageStoreInitial: LoginPageStore = {
	isFormValid: false,
	formStatus: FormStatus.default,
	formError: null,
}

export const useLoginPageStore = create<LoginPageStore>()((set) => {
	return loginPageStoreInitial
})
