import { create } from 'zustand'

export type EmailConfirmationStore = {
	errorMessage: null | string
	// If a mail confirmation request is set to true
	confirmEmailLoading: boolean
	setErrorMessage: (message: string) => void
	setConfirmEmailLoading: (isLoading: boolean) => void
}

export const emailConfirmationStoreInitial: EmailConfirmationStore = {
	errorMessage: null,
	confirmEmailLoading: false,
	setErrorMessage(message: string) {},
	setConfirmEmailLoading(isLoading: boolean) {}
}

export const useEmailConfirmationStore = create<EmailConfirmationStore>()((set) => ({
	...emailConfirmationStoreInitial,
	setErrorMessage: (message: string) => {
		return set({ errorMessage: message, confirmEmailLoading: false })
	},
	setConfirmEmailLoading: (isLoading: boolean) => {
		return set({ confirmEmailLoading: isLoading })
	}
}))
