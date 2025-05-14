import { INestApplication } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
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
import { defSenderEmail, defSenderPassword, extractErrObjFromResp, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../../src/features/test/queries'
import { seedTestData } from '../utils/seedTestData'
import '../utils/jestExtendFunctions'

describe.skip('Register a sender (e2e)', () => {
	let app: INestApplication<App>
	let commandBus: CommandBus
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
		commandBus = app.get(CommandBus)
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
		await seedTestData(commandBus)
		jest.clearAllMocks()
	})

	it('should return error if wrong data was passed', async () => {
		const registerSenderMutation = queries.auth.registerSender({ email: 'johnexample.com', password: 'my' })

		const [createAdminResp] = await makeGraphQLReq(app, registerSenderMutation)

		expect(createAdminResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(createAdminResp)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.wrongInputData,
			fields: {
				email: ['The email must match the format example@mail.com'],
				password: [errorMessage.minCharacters(6)],
			},
		})
	})

	it('should return a created sender', async () => {
		const registerSenderMutation = queries.auth.registerSender({
			email: defSenderEmail,
			password: defSenderPassword,
		})

		const [createSenderResp] = await makeGraphQLReq(app, registerSenderMutation)

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)

		expect(createSenderResp.data[RouteNames.AUTH.REGISTER_SENDER]).toEqual({
			id: expect.any(Number),
			email: defSenderEmail,
			firstName: null,
			lastName: null,
			passportNum: null,
			balance: 0,
			active: false,
			role: 'sender',
		})

		const senderId = createSenderResp.data[RouteNames.AUTH.REGISTER_SENDER].id
		const createdUser = await userQueryRepository.getUserById(senderId)

		expect(createdUser).toEqual({
			id: expect.any(Number),
			email: defSenderEmail,
			role: 'sender',
		})
	})

	it('should return error if a sender is already created, but his email is not confirmed', async () => {
		const registerSenderMutation = queries.auth.registerSender({
			email: defSenderEmail,
			password: defSenderPassword,
		})

		await makeGraphQLReq(app, registerSenderMutation)
		const [createAdminResp2] = await makeGraphQLReq(app, registerSenderMutation)

		const firstErr = extractErrObjFromResp(createAdminResp2)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.emailIsNotConfirmed,
		})
	})

	it('should return error if the sender is already created and his email is confirmed', async () => {
		const registerSenderMutation = queries.auth.registerSender({
			email: defSenderEmail,
			password: defSenderPassword,
		})

		const [createSenderResp1] = await makeGraphQLReq(app, registerSenderMutation)
		const firstSenderId = createSenderResp1.data[RouteNames.AUTH.REGISTER_SENDER].id
		await userRepository.makeEmailVerified(firstSenderId)

		const [createSenderResp2] = await makeGraphQLReq(app, registerSenderMutation)
		const firstErr = extractErrObjFromResp(createSenderResp2)

		expect(firstErr).toStrictEqual({
			code: 400,
			message: errorMessage.emailIsAlreadyRegistered,
		})
	})
})
