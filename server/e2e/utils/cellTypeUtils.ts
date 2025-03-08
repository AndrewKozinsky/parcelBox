import { INestApplication } from '@nestjs/common'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { queries } from '../../src/features/test/queries'

export const cellTypeUtils = {
	// Create parcel box type
	async createCellType(props: {
		app: INestApplication
		cellTypeRepository: CellTypeRepository
		name: string
		width: number
		height: number
		depth: number
		parcelBoxTypeId: number
	}) {
		const createCellTypeMutation = queries.cellType.create({
			name: props.name,
			width: props.width,
			height: props.height,
			depth: props.depth,
			parcelBoxTypeId: props.parcelBoxTypeId,
		})

		const [createCellTypeResp] = await makeGraphQLReq(props.app, createCellTypeMutation)

		const cellTypeId = createCellTypeResp.data[RouteNames.CELL_TYPE.CREATE].id

		const cellType = await props.cellTypeRepository.getCellTypeById(cellTypeId)
		if (!cellType) {
			throw new Error('CellType not found')
		}

		return cellType
	},
	async getCellTypesOfParcelBoxTypeWithName(props: {
		app: INestApplication
		cellTypeRepository: CellTypeRepository
		parcelBoxTypeName: string
	}) {
		return await props.cellTypeRepository.getCellTypesOfParcelBoxTypeWithName(props.parcelBoxTypeName)
	},
}
