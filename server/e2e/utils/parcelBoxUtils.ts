import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellRepository } from '../../src/repo/cell.repository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { queries } from '../../src/features/test/queries'

export const parcelBoxUtils = {
	// Create parcel box with cells
	async createParcelBoxWithCells(props: {
		app: INestApplication
		parcelBoxRepository: ParcelBoxRepository
		cellRepository: CellRepository
		userId: number
		parcelBoxTypeId: number
	}) {
		const createParcelBoxMutation = queries.parcelBox.create({
			userId: props.userId,
			parcelBoxTypeId: props.parcelBoxTypeId,
		})

		const [createParcelBoxResp] = await makeGraphQLReq(props.app, createParcelBoxMutation)

		return createParcelBoxResp.data[RouteNames.PARCEL_BOX.CREATE]
	},
	async getParcelBoxTypeIdByName(props: {
		app: INestApplication
		parcelBoxTypeRepository: ParcelBoxTypeRepository
		parcelBoxTypeName: string
	}) {
		return await props.parcelBoxTypeRepository.getParcelBoxTypeIdByName(props.parcelBoxTypeName)
	},

	checkParcelBoxObject(parcelBoxObj: any) {
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
	},
}
