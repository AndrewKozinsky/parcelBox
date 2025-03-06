import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { ParcelBoxTypeQueryRepository } from '../../src/repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq } from '../makeGQReq'
import { cellTypeUtils } from '../utils/cellTypeUtils'
import { extractErrObjFromResp, seedTestData } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../../src/features/test/queries'
import { parcelBoxTypeUtils } from '../utils/parcelBoxTypeUtils'

describe.skip('Create parcel box type (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let parcelBoxTypeRepository: ParcelBoxTypeRepository
	let parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository
	let cellTypeRepository: CellTypeRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeRepository)
		parcelBoxTypeQueryRepository = await app.resolve(ParcelBoxTypeQueryRepository)
		cellTypeRepository = await app.resolve(CellTypeRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedTestData({ app, userRepository })
		jest.clearAllMocks()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return error if wrong data was passed (1)', async () => {
		const createCellTypeMutation = queries.cellType.create({
			name: '',
			width: 2,
			height: 3,
			depth: 4,
			parcelBoxTypeId: 99,
		})

		const [createCellTypeResp] = await makeGraphQLReq(app, createCellTypeMutation)

		expect(createCellTypeResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createCellTypeResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.wrongInputData,
			code: 400,
			fields: {
				name: [errorMessage.minCharacters(1)],
				width: [errorMessage.minNum(5)],
				height: [errorMessage.minNum(5)],
				depth: [errorMessage.minNum(5)],
				parcelBoxTypeId: [errorMessage.parcelBoxTypeDoesNotExist],
			},
		})
	})

	it('should return error if wrong data was passed (2)', async () => {
		const createCellTypeMutation = queries.cellType.create({
			name: 'parcelBoxTypeIdparcelBoxTypeIdparcelBoxTypeIdparcelBoxTypeIdparcelBoxTypeIdparcelBoxTypeIdxTypeIdparcelBoxTypeIdxTypeIdparcelBoxTypeId',
			width: 200,
			height: 300,
			depth: 400,
			parcelBoxTypeId: 99,
		})

		const [createCellTypeResp] = await makeGraphQLReq(app, createCellTypeMutation)

		expect(createCellTypeResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createCellTypeResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.wrongInputData,
			code: 400,
			fields: {
				name: [errorMessage.maxCharacters(100)],
				width: [errorMessage.maxNum(100)],
				height: [errorMessage.maxNum(100)],
				depth: [errorMessage.maxNum(100)],
				parcelBoxTypeId: [errorMessage.parcelBoxTypeDoesNotExist],
			},
		})
	})

	it('should create a new cell box type', async () => {
		// Create parcel box type
		const parcelBoxType = await parcelBoxTypeUtils.createParcelBoxType({
			app,
			parcelBoxTypeRepository,
		})
		if (!parcelBoxType) return

		// Create a cell type belongs to this parcel box type
		const cellType = await cellTypeUtils.createCellType({
			app,
			cellTypeRepository,
			name: 'Cell A1',
			width: 20,
			height: 30,
			depth: 40,
			parcelBoxTypeId: parcelBoxType.id,
		})

		expect(cellType).toStrictEqual({
			id: 1,
			name: 'Cell A1',
			width: 20,
			height: 30,
			depth: 40,
			parcelBoxTypeId: 1,
		})

		// Check if there is a new cell type in the database
		const newCellType = parcelBoxTypeRepository.getParcelBoxTypeById(cellType.id)
		expect(newCellType).toBeTruthy()
	})
})
