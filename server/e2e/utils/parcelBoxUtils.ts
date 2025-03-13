import { INestApplication } from '@nestjs/common'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellRepository } from '../../src/repo/cell.repository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { makeGraphQLReqWithTokens } from '../makeGQReq'
import { queries } from '../../src/features/test/queries'
import { JSRegularTypes } from './jestExtendFunctions'

export const parcelBoxUtils = {
	// Create parcel box with cells
	async createParcelBoxWithCells(
		resources: {
			app: INestApplication
			parcelBoxRepository: ParcelBoxRepository
			cellRepository: CellRepository
			refreshTokenStr: string
			accessTokenStr: string
			mainConfig: MainConfigService
		},
		boxProps: {
			userId: number
			parcelBoxTypeId: number
			address?: string
			businessDays?: number[]
			businessTimeFrom?: string
			businessTimeTo?: string
		},
	) {
		let createParcelBoxMutationProps = boxProps
		// If businessDays was passed then I have to convert
		// array of days: [ 1, 2, 3, 5 ]
		// into string: '[ 1, 2, 3, 5 ]'
		if (boxProps.businessDays && boxProps.businessDays.length) {
			// @ts-ignore
			createParcelBoxMutationProps = { ...boxProps, businessDays: '[' + boxProps.businessDays + ']' }
		}
		const createParcelBoxMutation = queries.parcelBox.create(createParcelBoxMutationProps)

		const [createParcelBoxResp] = await makeGraphQLReqWithTokens({
			query: createParcelBoxMutation,
			...resources,
		})

		return createParcelBoxResp.data[RouteNames.PARCEL_BOX.CREATE]
	},
	async getParcelBoxTypeIdByName(props: {
		app: INestApplication
		parcelBoxTypeRepository: ParcelBoxTypeRepository
		parcelBoxTypeName: string
	}) {
		return await props.parcelBoxTypeRepository.getParcelBoxTypeByName(props.parcelBoxTypeName)
	},

	checkParcelBoxObject(parcelBoxObj: any) {
		expect(parcelBoxObj).toEqual({
			id: expect.any(Number),
			parcelBoxTypeId: expect.any(Number),
			parcelBoxTypeName: expect.any(String),
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
				// @ts-ignore
				address: expect.oneOfTypes(['string', 'null'] as JSRegularTypes[]),
				// @ts-ignore
				businessTimeFrom: expect.oneOfTypes(['string', 'null'] as JSRegularTypes[]),
				// @ts-ignore
				businessTimeTo: expect.oneOfTypes(['string', 'null'] as JSRegularTypes[]),
				// @ts-ignore
				businessDays: expect.arrayContainingAnyNumberOfElems(Number),
			}),
		})
	},
}
