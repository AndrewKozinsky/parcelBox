import { useCallback } from 'react'
import { useDeleteParcelBoxStore } from '../deleteParcelBoxStore'

export function useGetChangeModalVisibility(currentBoxId: null | number) {
	return useCallback(function () {
		useDeleteParcelBoxStore.setState({ currentBoxId })
	}, [])
}
