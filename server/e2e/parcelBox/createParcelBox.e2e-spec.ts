import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellRepository } from '../../src/repo/cell.repository'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { ParcelBoxQueryRepository } from '../../src/repo/parcelBox.queryRepository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeQueryRepository } from '../../src/repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { seedTestData } from '../utils/seedTestData'

describe.skip('Create parcel box (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let parcelBoxTypeRepository: ParcelBoxTypeRepository
	let parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository
	let cellTypeRepository: CellTypeRepository
	let parcelBoxQueryRepository: ParcelBoxQueryRepository
	let parcelBoxRepository: ParcelBoxRepository
	let cellRepository: CellRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeRepository)
		parcelBoxTypeQueryRepository = await app.resolve(ParcelBoxTypeQueryRepository)
		cellTypeRepository = await app.resolve(CellTypeRepository)
		parcelBoxQueryRepository = await app.resolve(ParcelBoxQueryRepository)
		parcelBoxRepository = await app.resolve(ParcelBoxRepository)
		cellRepository = await app.resolve(CellRepository)
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedInitDataInDatabase(app)
		await seedTestData({
			app,
			userRepository,
			parcelBoxRepository,
			cellRepository,
			parcelBoxTypeRepository,
		})
		jest.clearAllMocks()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('test', async () => {
		expect(2).toBe(2)
	})

	/*it.only('should return error if wrong data was passed', async () => {
		const createParcelBoxMutation = queries.parcelBox.create({ parcelBoxTypeId: 99 })

		const [createParcelBoxResp] = await makeGraphQLReq(app, createParcelBoxMutation)

		expect(createParcelBoxResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createParcelBoxResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.wrongInputData,
			code: 400,
			fields: {
				parcelBoxTypeId: [errorMessage.parcelBoxTypeDoesNotExist],
			},
		})
	})*/

	/*it('should create a new parcel box with cells', async () => {
		// Create types
		const createBoxAndCellTypes = await parcelBoxTypeUtils.createParcelBoxTypeWithCells({
			app,
			parcelBoxTypeRepository,
			cellTypeRepository,
		})
		if (!createBoxAndCellTypes) return
		const { parcelBoxType, cellType_1, cellType_2 } = createBoxAndCellTypes

		// Create physical Parcel box and cells
		const createParcelBoxMutation = queries.parcelBox.create({ parcelBoxTypeId: parcelBoxType.id })
		const [createParcelBoxResp] = await makeGraphQLReq(app, createParcelBoxMutation)

		expect(createParcelBoxResp.errors).toBe(undefined)

		const respData = createParcelBoxResp.data[RouteNames.PARCEL_BOX.CREATE]

		parcelBoxTypeUtils.checkParcelBoxObject(respData)

		// Check if there is a new parcel box in the database
		const parcelBox = parcelBoxQueryRepository.getParcelBoxById(respData.id)
		expect(parcelBox).toBeTruthy()
	})*/
})
