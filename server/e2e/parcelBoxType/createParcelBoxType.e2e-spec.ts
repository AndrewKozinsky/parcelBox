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
import { makeGraphQLReq } from '../makeGQReq'
import { defAdminEmail, defAdminPassword, extractErrObjFromResp, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../../src/features/test/queries'
import { seedTestData } from '../utils/seedTestData'

describe.skip('Create parcel box type (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository

	let parcelBoxTypeRepository: ParcelBoxTypeRepository
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
		parcelBoxTypeQueryRepository = await app.resolve(ParcelBoxTypeQueryRepository)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeRepository)
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

	it('should return error if wrong data was passed', async () => {
		const createParcelBoxTypeMutation = queries.parcelBoxType.create({ name: '' })

		const [createParcelBoxTypeResp] = await makeGraphQLReq(app, createParcelBoxTypeMutation)

		expect(createParcelBoxTypeResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createParcelBoxTypeResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.wrongInputData,
			code: 400,
			fields: {
				name: ['Минимальное количество символов: 1'],
			},
		})
	})

	it('should create a new parcel box type', async () => {
		const createParcelBoxTypeMutation = queries.parcelBoxType.create({ name: 'universal box' })

		const [createParcelBoxTypeResp] = await makeGraphQLReq(app, createParcelBoxTypeMutation)

		expect(createParcelBoxTypeResp.errors).toBe(undefined)

		const respData = createParcelBoxTypeResp.data[RouteNames.PARCEL_BOX_TYPE.CREATE]
		expect(respData).toStrictEqual({
			id: 1,
			name: 'universal box',
		})

		// Check if there is a new parcel box in the database
		const parcelBox = parcelBoxTypeQueryRepository.getParcelBoxTypeById(respData.id)
		expect(parcelBox).toBeTruthy()
	})
})
