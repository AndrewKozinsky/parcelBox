import { Injectable } from '@nestjs/common'
import { MainConfigService } from '../config/mainConfig.service'

type DaDataAddressSuggestions = {
	suggestions: DaDataAddressSuggestion[]
}
type DaDataAddressSuggestion = {
	value: string // 'г Оренбург, ул Транспортная'
	unrestricted_value: string //  'Оренбургская обл, г Оренбург, ул Транспортная'
	data: {
		postal_code: null
		country: string // 'Россия'
		country_iso_code: string // 'RU'
		federal_district: string // 'Приволжский'
		region_fias_id: string // '8bcec9d6-05bc-4e53-b45c-ba0c6f3a5c44'
		region_kladr_id: string // '5600000000000'
		region_iso_code: string // 'RU-ORE'
		region_with_type: string // 'Оренбургская обл'
		region_type: string // 'обл'
		region_type_full: string // 'область'
		region: string // 'Оренбургская'
		area_fias_id: null
		area_kladr_id: null
		area_with_type: null
		area_type: null
		area_type_full: null
		area: null
		city_fias_id: string // 'dce97bff-deb2-4fd9-9aec-4f4327bbf89b'
		city_kladr_id: string // '5600000100000'
		city_with_type: string // 'г Оренбург'
		city_type: string // 'г'
		city_type_full: string // 'город'
		city: string // 'Оренбург'
		city_area: null
		city_district_fias_id: null
		city_district_kladr_id: null
		city_district_with_type: null
		city_district_type: null
		city_district_type_full: null
		city_district: null
		settlement_fias_id: null
		settlement_kladr_id: null
		settlement_with_type: null
		settlement_type: null
		settlement_type_full: null
		settlement: null
		street_fias_id: string // '682bbf5e-ecda-4431-b949-f85e562e6b31'
		street_kladr_id: string // '56000001000106600'
		street_with_type: string // 'ул Транспортная'
		street_type: string // 'ул'
		street_type_full: string // 'улица'
		street: string // 'Транспортная'
		stead_fias_id: null
		stead_cadnum: null
		stead_type: null
		stead_type_full: null
		stead: null
		house_fias_id: null
		house_kladr_id: null
		house_cadnum: null
		house_flat_count: null
		house_type: null
		house_type_full: null
		house: null
		block_type: null
		block_type_full: null
		block: null
		entrance: null
		floor: null
		flat_fias_id: null
		flat_cadnum: null
		flat_type: null
		flat_type_full: null
		flat: null
		flat_area: null
		square_meter_price: null
		flat_price: null
		room_fias_id: null
		room_cadnum: null
		room_type: null
		room_type_full: null
		room: null
		postal_box: null
		fias_id: string // '682bbf5e-ecda-4431-b949-f85e562e6b31'
		fias_code: null
		fias_level: string // '7'
		fias_actuality_state: string // '0'
		kladr_id: string // '56000001000106600'
		geoname_id: string // '515003'
		capital_marker: string // '2'
		okato: string // '53401000000'
		oktmo: string // '53701000001'
		tax_office: string // '5600'
		tax_office_legal: string // '5600'
		timezone: null
		geo_lat: string // '51.817325'
		geo_lon: string // '55.154474'
		beltway_hit: null
		beltway_distance: null
		metro: null
		divisions: null
		qc_geo: string // '2'
		qc_complete: null
		qc_house: null
		history_values: null
		unparsed_parts: null
		source: null
		qc: null
	}
}

@Injectable()
export class AddressAdapterService {
	constructor(private mainConfig: MainConfigService) {}

	/**
	 * Takes some address then it makes a request to service DaData,
	 * gets similar addresses and return array of these addresses.
	 * @param queryAddress — some address
	 */
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
			const serverResp = await rowTextResp.text()

			const daDataSuggestions: DaDataAddressSuggestions = JSON.parse(serverResp)

			return daDataSuggestions.suggestions.map((suggestion) => {
				return suggestion.value
			})
		} catch (err: unknown) {
			console.log(err)
		}
	}
}
