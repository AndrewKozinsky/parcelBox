import { useCallback } from 'react'
import { useParcelBoxDelete, useParcelBoxGetMine } from '../../../../../graphql'
import { useDeleteParcelBoxStore } from '../deleteParcelBoxStore'

export function useGetDeleteParcelBox(parcelBoxId: number) {
	const [deleteBoxRequest] = useParcelBoxDelete({ fetchPolicy: 'no-cache' })
	const { refetch: refetchMyBoxes } = useParcelBoxGetMine()

	return useCallback(async function () {
		const requestParams = { variables: { input: { parcelBoxId } } }

		deleteBoxRequest(requestParams)
			.then((data) => {
				refetchMyBoxes()
			})
			.catch((error) => {
				console.log(error)
			})
			.finally(() => {
				useDeleteParcelBoxStore.setState({ currentBoxId: null })
			})
	}, [])
}
