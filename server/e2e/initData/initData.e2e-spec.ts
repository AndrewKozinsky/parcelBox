import { INestApplication } from '@nestjs/common'
import { agent as request } from 'supertest'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { CellTypeRepository } from '../../src/repo/cellType.repository'
import { ParcelBoxTypeQueryRepository } from '../../src/repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../src/repo/parcelBoxType.repository'
import { UserQueryRepository } from '../../src/repo/user.queryRepository'
import { UserRepository } from '../../src/repo/user.repository'
import { createApp } from '../utils/createMainApp'

describe.skip('Check init data (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService
	let userRepository: UserRepository
	let userQueryRepository: UserQueryRepository
	let parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository
	let parcelBoxTypeRepository: ParcelBoxTypeRepository
	let cellTypeRepository: CellTypeRepository

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
		userRepository = await app.resolve(UserRepository)
		userQueryRepository = await app.resolve(UserQueryRepository)
		parcelBoxTypeQueryRepository = await app.resolve(ParcelBoxTypeQueryRepository)
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeRepository)
		cellTypeRepository = await app.resolve(CellTypeRepository)
	})

	beforeEach(async () => {
		// await clearAllDB(app)
		// await seedInitDataInDatabase(app)
		// await seedTestData({ app, userRepository, parcelBoxRepository, cellRepository, cellTypeRepository })
		jest.clearAllMocks()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should found init data after app started', async () => {
		await checkDatabaseInitData(parcelBoxTypeRepository, cellTypeRepository)
	})

	it('should clear add data at first then make request and seed init data', async () => {
		await clearAllDB(app)

		const res = await request(app.getHttpServer()).post('/' + RouteNames.INIT_DATA.SEED)
		expect(res.statusCode).toBe(204)
		expect(res.body).toStrictEqual({})

		await checkDatabaseInitData(parcelBoxTypeRepository, cellTypeRepository)
	})
})

async function checkDatabaseInitData(
	parcelBoxTypeRepository: ParcelBoxTypeRepository,
	cellTypeRepository: CellTypeRepository,
) {
	const parcelBoxTypes = await parcelBoxTypeRepository.getAllParcelBoxTypes()
	expect(parcelBoxTypes.length).toBe(3)
	expect(parcelBoxTypes[0].name).toBe('small')
	expect(parcelBoxTypes[1].name).toBe('medium')
	expect(parcelBoxTypes[2].name).toBe('large')

	const cellTypes = await cellTypeRepository.getAllCellTypes()
	expect(cellTypes.length).toBe(12)
}
