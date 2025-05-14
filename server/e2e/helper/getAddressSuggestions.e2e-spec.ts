import { INestApplication } from '@nestjs/common'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { queries } from '../../src/features/test/queries'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import RouteNames from '../../src/infrastructure/routeNames'
import { makeGraphQLReq } from '../makeGQReq'
import { seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import '../utils/jestExtendFunctions'

describe.skip('Get address suggestions my parcel box (e2e)', () => {
	let app: INestApplication<App>
	let emailAdapter: EmailAdapterService

	beforeAll(async () => {
		const createMainAppRes = await createApp({ emailAdapter })

		app = createMainAppRes.app
		emailAdapter = createMainAppRes.emailAdapter
	})

	beforeEach(async () => {
		await clearAllDB(app)
		await seedInitDataInDatabase(app)
		// await seedTestData(commandBus)
		jest.clearAllMocks()
	})

	it('should return array of similar addresses', async () => {
		// Try to get created parcel boxes
		const getAddressSuggestionsQuery = queries.helper.getAddressSuggestions('Оренбург, проезд Северный')
		const [getAddressSuggestionsRes] = await makeGraphQLReq(app, getAddressSuggestionsQuery)
		const getAddressSuggestionsData = getAddressSuggestionsRes.data[RouteNames.HELPER.ADDRESS_SUGGESTIONS]

		expect(getAddressSuggestionsData.length).toBe(10)
	})
})
