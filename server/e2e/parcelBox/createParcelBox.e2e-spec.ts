import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
import { queries } from '../../src/features/test/queries'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
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
import { makeGraphQLReq, makeGraphQLReqWithTokens } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { parcelBoxTypeUtils } from '../utils/parcelBoxTypeUtils'
import { parcelBoxUtils } from '../utils/parcelBoxUtils'
import { seedTestData } from '../utils/seedTestData'
import { userUtils } from '../utils/userUtils'

describe('Create parcel box (e2e)', () => {
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
	let mainConfig: MainConfigService

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
		mainConfig = await app.resolve(MainConfigService)
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

	it('should return error if wrong data was passed', async () => {
		const createParcelBoxMutation = queries.parcelBox.create({ userId: 98, parcelBoxTypeId: 99 })
		const [createParcelBoxResp] = await makeGraphQLReq(app, createParcelBoxMutation)

		expect(createParcelBoxResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createParcelBoxResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.wrongInputData,
			code: 400,
			fields: {
				parcelBoxTypeId: [errorMessage.parcelBoxTypeDoesNotExist],
				userId: [errorMessage.userNotFound],
			},
		})
	})

	it.only('should create a new parcel box with cells', async () => {
		// Create an admin who will create a new parcel box
		const { loginData, accessToken, refreshToken } = await userUtils.createUserAndLogin({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})

		if (!loginData || !accessToken) {
			throw new Error('Unable to login user')
		}

		// Get existing parcel box types
		const largeParcelBoxType = await parcelBoxTypeUtils.getByName({
			parcelBoxTypeName: 'large',
			parcelBoxTypeRepository,
		})

		// Create a new parcel box based on the existing parcel box type
		const createdParcelBox = await parcelBoxUtils.createParcelBoxWithCells({
			app,
			userId: loginData.id,
			parcelBoxTypeId: largeParcelBoxType.id,
			parcelBoxRepository,
			cellRepository,
		})

		// Check parcel boxes data structure
		parcelBoxUtils.checkParcelBoxObject(createdParcelBox)

		// Check that created parcel boxes has the same parcelBoxTypeId from which they were created
		expect(createdParcelBox.parcelBoxTypeId).toBe(largeParcelBoxType.id)

		// Try to get created parcel boxes
		const getMyParcelBoxesQuery = queries.parcelBox.getMine()
		const [getMyParcel] = await makeGraphQLReqWithTokens({
			app,
			query: getMyParcelBoxesQuery,
			accessTokenStr: accessToken.value,
			mainConfig,
		})
		const getMyParcelData = getMyParcel.data[RouteNames.PARCEL_BOX.GET_MINE]

		// Check that there are only 1 element in the array
		expect(getMyParcelData.length).toBe(1)
	})
})
