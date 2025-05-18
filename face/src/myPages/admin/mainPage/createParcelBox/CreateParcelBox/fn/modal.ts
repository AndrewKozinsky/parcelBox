import { useCallback } from 'react'
import { useAddParcelBoxStore } from '../../addParcelBoxStore'

export function useGetChangeModalVisibility(isModalOpen: boolean) {
	return useCallback(function () {
		useAddParcelBoxStore.setState({ isModalOpen })
	}, [])
}
