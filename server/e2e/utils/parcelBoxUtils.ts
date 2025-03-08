import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellRepository } from '../../src/repo/cell.repository'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { queries } from '../../src/features/test/queries'
import { cellTypeUtils } from './cellTypeUtils'

export const parcelBoxUtils = {
	// Create parcel box type
	async createParcelBox(props: {
		app: INestApplication
		parcelBoxRepository: ParcelBoxRepository
		userId: number
		parcelBoxTypeId: number
	}) {
		const createParcelBoxMutation = queries.parcelBox.create({
			userId: props.userId,
			parcelBoxTypeId: props.parcelBoxTypeId,
		})

		const [createParcelBoxResp] = await makeGraphQLReq(props.app, createParcelBoxMutation)
		// console.log(createParcelBoxResp)

		/*const parcelBoxId = createParcelBoxResp.data[RouteNames.PARCEL_BOX.CREATE].id

		return parcelBoxId as number*/
	},
	// Create parcel box type with cell types
	async createParcelBoxWithCells(props: {
		app: INestApplication
		parcelBoxRepository: ParcelBoxRepository
		cellRepository: CellRepository
		userId: number
		parcelBoxTypeId: number
	}) {
		// Create parcel box type
		const parcelBoxId = await parcelBoxUtils.createParcelBox({
			app: props.app,
			parcelBoxRepository: props.parcelBoxRepository,
			userId: props.userId,
			parcelBoxTypeId: props.parcelBoxTypeId,
		})

		// Create cells belong to created parcel box
		/*const cellType_1 = await cellTypeUtils.createCellType({
			app: props.app,
			cellTypeRepository: props.cellTypeRepository,
			name: 'A1',
			width: 21,
			height: 31,
			depth: 41,
			parcelBoxTypeId: parcelBoxType.id,
		})*/

		/*return {
			parcelBoxType,
			cellType_1,
			cellType_2,
		}*/
	},
	async getParcelBoxTypeIdByName(props: {
		app: INestApplication
		parcelBoxTypeRepository: ParcelBoxTypeRepository
		parcelBoxTypeName: string
	}) {
		return await props.parcelBoxTypeRepository.getParcelBoxTypeIdByName(props.parcelBoxTypeName)
	},

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
