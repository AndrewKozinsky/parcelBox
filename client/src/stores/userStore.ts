import { create } from 'zustand'

interface UserStore {
	user: number
	// increase: (by: number) => void
}

const useBearStore = create<UserStore>()((set) => {
	return {
		user: 0,
		// increase: (by) => set((state) => ({ user: state.user + by })),
	}
})
