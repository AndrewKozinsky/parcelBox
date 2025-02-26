import { create } from 'zustand'
import { SenderOutModel, UserOutModel } from '../graphql'

interface UserStore {
	user: null | UserOutModel | SenderOutModel
	isLoading: boolean
	isError: boolean
}

export const useUserStore = create<UserStore>()((set) => {
	return {
		user: null,
		isLoading: true,
		isError: false,
	}
})
