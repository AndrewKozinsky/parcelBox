// import { useApolloClient } from '@apollo/client'
// import { useCallback } from 'react'
// import { HelperAddressSuggestionsDocument } from '../../../../../../graphql'
// import { debounce } from '../../../../../../utils/other'
// import { AddParcelBoxStore, useAddParcelBoxStore } from '../../addParcelBoxStore'

/*export function useGetOnAddressFieldSearch() {
	const gqiClient = useApolloClient()

	return useCallback(
		debounce(async function (userTypedAddress: string) {
			if (userTypedAddress.length < 5) {
				return
			}

			try {
				const { data } = await gqiClient.query({
					query: HelperAddressSuggestionsDocument,
					fetchPolicy: 'no-cache',
					variables: {
						input: {
							address: userTypedAddress,
						},
					},
				})

				const addressesFromServer = data['helper_addressSuggestions']

				const addressSuggestions: AddParcelBoxStore['addressSuggestions'] = addressesFromServer.map(
					(address: string) => {
						return {
							value: address,
						}
					},
				)

				useAddParcelBoxStore.setState({ addressSuggestions })
			} catch (err: unknown) {
				console.error(err)
			}
		}, 600),
		[],
	)
}*/
