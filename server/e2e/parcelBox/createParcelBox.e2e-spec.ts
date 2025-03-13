import { INestApplication } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
import { queries } from '../../src/features/test/queries'
import { MainConfigService } from '../../src/infrastructure/config/mainConfig.service'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellRepository } from '../../src/repo/cell.repository'
import { ParcelBoxRepository } from '../../src/repo/parcelBox.repository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserRepository } from '../../src/repo/user.repository'
import { makeGraphQLReq, makeGraphQLReqWithTokens } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { parcelBoxTypeUtils } from '../utils/parcelBoxTypeUtils'
import { parcelBoxUtils } from '../utils/parcelBoxUtils'
import { seedTestData } from '../utils/seedTestData'
import { userUtils } from '../utils/userUtils'
import '../utils/jestExtendFunctions'

describe('Create parcel box (e2e)', () => {
	let app: INestApplication<App>
	let commandBus: CommandBus
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let parcelBoxTypeRepository: ParcelBoxTypeRepository
	let parcelBoxRepository: ParcelBoxRepository
	let cellRepository: CellRepository
	let mainConfig: MainConfigService

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		commandBus = app.get(CommandBus)
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeRepository)
		parcelBoxRepository = await app.resolve(ParcelBoxRepository)
		cellRepository = await app.resolve(CellRepository)
		mainConfig = await app.resolve(MainConfigService)
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedInitDataInDatabase(app)
		await seedTestData(commandBus)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return error if wrong data was passed', async () => {
		const createParcelBoxMutation = queries.parcelBox.create({ parcelBoxTypeId: 99 })
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

	it('should create a new parcel box with default settings', async () => {
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
		const createdParcelBox = await parcelBoxUtils.createParcelBoxWithCells(
			{
				app,
				parcelBoxRepository,
				cellRepository,
				mainConfig,
				refreshTokenStr: refreshToken.value,
				accessTokenStr: accessToken.value,
			},
			{
				userId: loginData.id,
				parcelBoxTypeId: largeParcelBoxType.id,
			},
		)

		// Check parcel boxes data structure
		parcelBoxUtils.checkParcelBoxObject(createdParcelBox)
		console.log(createdParcelBox)

		// Check that created parcel boxes has the same parcelBoxTypeId from which they were created
		expect(createdParcelBox.parcelBoxTypeId).toBe(largeParcelBoxType.id)

		// Check that count of cell types in parcel box type is equal of cell count in created parcel box
		expect(largeParcelBoxType.cellTypes.length).toBe(createdParcelBox.cells.length)

		// Check that location object has default values
		expect(createdParcelBox.location).toStrictEqual({
			id: expect.any(Number),
			address: null,
			businessDays: [],
			businessTimeFrom: null,
			businessTimeTo: null,
		})

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

	it.only('should create a new parcel box with custom settings', async () => {
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
		const smallParcelBoxType = await parcelBoxTypeUtils.getByName({
			parcelBoxTypeName: 'small',
			parcelBoxTypeRepository,
		})

		// Create a new parcel box based on the existing parcel box type
		const address = '8 улица строителей'
		const businessDays = [1, 2, 3, 5, 6, 7]
		const businessTimeFrom = '11:20'
		const businessTimeTo = '11:30'
		const createdParcelBox = await parcelBoxUtils.createParcelBoxWithCells(
			{
				app,
				parcelBoxRepository,
				cellRepository,
				mainConfig,
				refreshTokenStr: refreshToken.value,
				accessTokenStr: accessToken.value,
			},
			{
				userId: loginData.id,
				parcelBoxTypeId: smallParcelBoxType.id,
				address,
				businessDays,
				businessTimeFrom,
				businessTimeTo,
			},
		)

		// Check parcel boxes data structure
		parcelBoxUtils.checkParcelBoxObject(createdParcelBox)

		// Check that created parcel boxes has the same parcelBoxTypeId from which they were created
		expect(createdParcelBox.parcelBoxTypeId).toBe(smallParcelBoxType.id)

		// Check that count of cell types in parcel box type is equal of cell count in created parcel box
		expect(smallParcelBoxType.cellTypes.length).toBe(createdParcelBox.cells.length)

		// Check that location object has default values
		expect(createdParcelBox.location).toStrictEqual({
			id: expect.any(Number),
			address,
			businessDays,
			businessTimeFrom,
			businessTimeTo,
		})

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
