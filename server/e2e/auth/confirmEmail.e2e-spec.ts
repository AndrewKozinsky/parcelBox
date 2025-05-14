import { INestApplication } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
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
import { extractErrObjFromResp, seedInitDataInDatabase } from '../utils/common'
import { createApp } from '../utils/createMainApp'
import { queries } from '../../src/features/test/queries'
import { seedTestData } from '../utils/seedTestData'
import { userUtils } from '../utils/userUtils'
import '../utils/jestExtendFunctions'

describe.skip('Confirm an user email (e2e)', () => {
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

	it('should return error if wrong confirmation code was passed', async () => {
		const confirmEmailQuery = queries.auth.confirmEmail('123')

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)

		expect(confirmEmailResp.data).toBe(null)

		const firstErr = extractErrObjFromResp(confirmEmailResp)

		expect(firstErr).toEqual({
			code: 400,
			message: errorMessage.emailConfirmationCodeNotFound,
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(0)
	})

	it('should return success if email is successfully confirmed', async () => {
		const createdAdmin = await userUtils.createUserWithUnconfirmedEmail({
			userRepository,
			app,
			role: UserRole.Admin,
		})
		if (!createdAdmin) return

		const { emailConfirmationCode } = createdAdmin

		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)
		expect(confirmEmailResp.data).toStrictEqual({
			[RouteNames.AUTH.CONFIRM_EMAIL]: true,
		})

		const updatedUser = await userRepository.getUserById(createdAdmin.id)
		if (!updatedUser) return

		expect(userUtils.isUserEmailConfirmed(updatedUser)).toBe(true)

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)
	})

	it('should return error if email verification allowed time is over', async () => {
		const createdAdmin = await userUtils.createUserWithUnconfirmedEmail({
			userRepository,
			app,
			role: UserRole.Admin,
		})
		if (!createdAdmin) return

		// Change email confirmation allowed time to past
		await userRepository.updateUser(createdAdmin!.id, {
			email_confirmation_code_expiration_date: new Date().toISOString(),
		})

		const { emailConfirmationCode } = createdAdmin

		// Try to confirm email
		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)
		const firstErr = extractErrObjFromResp(confirmEmailResp)

		expect(firstErr).toEqual({
			code: 400,
			message: errorMessage.emailConfirmationCodeIsExpired,
		})

		// Check the user's email is still unconfirmed
		const thisUser = await userRepository.getUserById(createdAdmin.id)
		if (!thisUser) return

		expect(userUtils.isUserEmailConfirmed(thisUser)).toBe(false)
	})

	it('should return 400 if they try to confirm email the second time', async () => {
		const createdAdmin = await userUtils.createUserWithUnconfirmedEmail({
			userRepository,
			app,
			role: UserRole.Admin,
		})
		if (!createdAdmin) return

		const { emailConfirmationCode } = createdAdmin

		// Try to confirm email
		const confirmEmailQuery = queries.auth.confirmEmail(emailConfirmationCode!)

		const [confirmEmailResp] = await makeGraphQLReq(app, confirmEmailQuery)
		expect(confirmEmailResp.data).toStrictEqual({
			[RouteNames.AUTH.CONFIRM_EMAIL]: true,
		})

		// Try to confirm email second time
		const [confirmEmailResp2] = await makeGraphQLReq(app, confirmEmailQuery)
		const firstErr = extractErrObjFromResp(confirmEmailResp2)

		expect(firstErr).toEqual({
			code: 400,
			message: errorMessage.emailConfirmationCodeNotFound,
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)
	})
})
