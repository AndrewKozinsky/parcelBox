import { create } from 'zustand'

export type DeleteParcelBoxStore = {
	currentBoxId: null | number
	loading: boolean
}

export const deleteParcelBoxStoreInitial: DeleteParcelBoxStore = {
	currentBoxId: null,
	loading: false,
}

export const useDeleteParcelBoxStore = create<DeleteParcelBoxStore>()((set) => {
	return deleteParcelBoxStoreInitial
})
