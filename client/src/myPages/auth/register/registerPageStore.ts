import { create } from 'zustand'

export enum RegisterFormStatus {
	default,
	submitPending,
	success,
	failure,
}

export type RegisterPageStore = {
	isFormValid: boolean
	formStatus: RegisterFormStatus
	registeredEmailDomain: null | string
	formError: null | string
}

export const registerPageStoreInitial: RegisterPageStore = {
	isFormValid: false,
	formStatus: RegisterFormStatus.default,
	registeredEmailDomain: null,
	formError: null,
}

export const useRegisterPageStore = create<RegisterPageStore>()((set) => {
	return registerPageStoreInitial
})
