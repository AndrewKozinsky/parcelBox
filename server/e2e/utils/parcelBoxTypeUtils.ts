import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { queries } from '../../src/features/test/queries'

export const parcelBoxTypeUtils = {
	// Create parcel box type
	async createParcelBoxType(props: { app: INestApplication; parcelBoxTypeRepository: ParcelBoxTypeRepository }) {
		const createParcelBoxTypeMutation = queries.parcelBoxType.create({ name: 'universal box' })
		const [createParcelBoxTypeResp] = await makeGraphQLReq(props.app, createParcelBoxTypeMutation)

		const parcelBoxTypeId = createParcelBoxTypeResp.data[RouteNames.PARCEL_BOX_TYPE.CREATE].id

		const parcelBoxType = await props.parcelBoxTypeRepository.getParcelBoxTypeById(parcelBoxTypeId)
		if (!parcelBoxType) {
			throw new Error('ParcelBoxType not found')
		}

		return parcelBoxType
	},
}
