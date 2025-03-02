import { create } from 'zustand'

export type EmailConfirmationStore = {
	errorMessage: null | string
	// If a mail confirmation request is made set to true
	confirmEmailLoading: boolean
}

export const emailConfirmationStoreInitial: EmailConfirmationStore = {
	errorMessage: null,
	confirmEmailLoading: false,
}

export const useEmailConfirmationStore = create<EmailConfirmationStore>()((set) => {
	return emailConfirmationStoreInitial
})
