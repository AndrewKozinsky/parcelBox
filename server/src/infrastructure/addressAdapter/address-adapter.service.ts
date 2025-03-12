import { Injectable } from '@nestjs/common'
import { MainConfigService } from '../config/mainConfig.service'

@Injectable()
export class AddressAdapterService {
	constructor(private mainConfig: MainConfigService) {}

	async makeSuggestions(queryAddress: string) {
		const url = 'http://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address'
		const token = this.mainConfig.get().daData.key

		const options = {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: 'Token ' + token,
			},
			body: JSON.stringify({ query: queryAddress }),
		} as const

		try {
			const rowTextResp = await fetch(url, options)
			const serverResp = rowTextResp.text()
			console.log(serverResp)

			return serverResp
		} catch (err: unknown) {
			console.log(err)
		}
	}
}
