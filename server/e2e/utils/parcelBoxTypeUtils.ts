import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { queries } from '../../src/features/test/queries'
import { cellTypeUtils } from './cellTypeUtils'

export const parcelBoxTypeUtils = {
	// Create parcel box type
	async createParcelBoxType(props: {
		app: INestApplication
		parcelBoxTypeRepository: ParcelBoxTypeRepository
		name?: string
	}) {
		const boxTypeName = props.name ?? 'universal box'

		const createParcelBoxTypeMutation = queries.parcelBoxType.create({ name: boxTypeName })
		const [createParcelBoxTypeResp] = await makeGraphQLReq(props.app, createParcelBoxTypeMutation)

		const parcelBoxTypeId = createParcelBoxTypeResp.data[RouteNames.PARCEL_BOX_TYPE.CREATE].id

		const parcelBoxType = await props.parcelBoxTypeRepository.getParcelBoxTypeById(parcelBoxTypeId)
		if (!parcelBoxType) {
			throw new Error('ParcelBoxType not found')
		}

		return parcelBoxType
	},
	// Create parcel box type with cell types
	async createParcelBoxTypeWithCells(props: {
		app: INestApplication
		parcelBoxTypeRepository: ParcelBoxTypeRepository
		cellTypeRepository: CellTypeRepository
		name?: string
	}) {
		// Create parcel box type
		const parcelBoxType = await parcelBoxTypeUtils.createParcelBoxType({
			app: props.app,
			parcelBoxTypeRepository: props.parcelBoxTypeRepository,
		})
		if (!parcelBoxType) return

		// Create cell types belongs to created parcel box type
		const cellType_1 = await cellTypeUtils.createCellType({
			app: props.app,
			cellTypeRepository: props.cellTypeRepository,
			name: 'A1',
			width: 21,
			height: 31,
			depth: 41,
			parcelBoxTypeId: parcelBoxType.id,
		})

		// Create cell types belongs to created parcel box type
		const cellType_2 = await cellTypeUtils.createCellType({
			app: props.app,
			cellTypeRepository: props.cellTypeRepository,
			name: 'A2',
			width: 22,
			height: 32,
			depth: 42,
			parcelBoxTypeId: parcelBoxType.id,
		})

		return {
			parcelBoxType,
			cellType_1,
			cellType_2,
		}
	},
	// DELETE !!!
	/*checkParcelBoxObject(parcelBoxObj: any) {
		expect(parcelBoxObj).toEqual({
			id: expect.any(Number),
			parcelBoxTypeId: expect.any(Number),
			createdAt: expect.any(String),
			cells: expect.arrayContaining([
				expect.objectContaining({
					id: expect.any(Number),
					name: expect.any(String),
					cellTypeId: expect.any(Number),
					parcelBoxId: expect.any(Number),
					width: expect.any(Number),
					height: expect.any(Number),
					depth: expect.any(Number),
				}),
			]),
			location: expect.objectContaining({
				id: expect.any(Number),
				address: expect.any(String),
				businessDays: expect.arrayContaining([expect.any(Number)]),
				businessHoursFrom: expect.any(Number),
				businessHoursTo: expect.any(Number),
			}),
		})
	},*/
}
