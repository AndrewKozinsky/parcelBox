import { create } from 'zustand'
import { AdminOutModel, SenderOutModel } from '../graphql'

export interface UserStore {
	senderUser: null | SenderOutModel
	adminUser: null | AdminOutModel
	isLoading: boolean
	isError: boolean
}

export const useUserStore = create<UserStore>()((set) => {
	return {
		senderUser: null,
		adminUser: null,
		isLoading: true,
		isError: false,
	}
})
