import { create } from 'zustand'
import { FormStatus } from '../../../common/form'

export type AddParcelBoxStore = {
	isModalOpen: boolean
	isFormValid: boolean
	formStatus: FormStatus
	// formError: null | string
}

export const addParcelBoxStoreInitial: AddParcelBoxStore = {
	isModalOpen: false,
	isFormValid: true,
	formStatus: FormStatus.default,
	// formError: null,
}

export const useAddParcelBoxStore = create<AddParcelBoxStore>()((set) => {
	return addParcelBoxStoreInitial
})
