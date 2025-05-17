import { create } from 'zustand'
import { AdminOutModel, SenderOutModel } from '../graphql'

export interface UserStore {
	senderUser: null | SenderOutModel
	adminUser: null | AdminOutModel
	isLoading: boolean
	// isLoggedOut: boolean
	setAdminUser: (user: AdminOutModel) => void
	setSenderUser: (user: SenderOutModel) => void
	clearUser: () => void
	// logout: () => void
}

export const useUserStore = create<UserStore>()((set) => {
	return {
		senderUser: null,
		adminUser: null,
		isLoading: true,
		// isLoggedOut: false,

		setAdminUser: (user: AdminOutModel) => {
			set((state) => {
				return { adminUser: user, isLoading: false }
			})
		},
		setSenderUser: (user: SenderOutModel) => {
			set((state) => {
				return { senderUser: user, isLoading: false }
			})
		},
		clearUser: () => {
			set((state) => {
				return { adminUser: null, senderUser: null, isLoading: false }
			})
		},
		/*logout: () => {
			set((state) => {
				return { adminUser: null, senderUser: null, isLoggedOut: true }
			})
		},*/
	}
})
