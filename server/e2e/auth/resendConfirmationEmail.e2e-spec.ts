import { INestApplication } from '@nestjs/common'
import { add, subDays } from 'date-fns'
import { App } from 'supertest/types'
import { clearAllDB } from '../../src/db/clearDB'
import { UserRole } from '../../src/db/dbConstants'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'
import { errorMessage } from '../../src/infrastructure/exceptions/errorMessage'
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
import { seedTestData } from '../utils/seedData'
import { userUtils } from '../utils/userUtils'

describe.skip('Confirm an user email (e2e)', () => {
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
		parcelBoxTypeRepository = await app.resolve(ParcelBoxTypeQueryRepository)
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
			cellTypeRepository,
			parcelBoxTypeRepository,
		})
		jest.clearAllMocks()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('should return error if input has incorrect values', async () => {
		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail('johnexample.com')
		const [resendConfirmationEmailResp] = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		const firstErr = extractErrObjFromResp(resendConfirmationEmailResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.wrongInputData,
			code: 400,
			fields: {
				email: ['The email must match the format example@mail.com'],
			},
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(0)
	})

	it('should return an error if the entered email is not exists', async () => {
		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail('john@example.com')
		const [resendConfirmationEmailResp] = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		const firstErr = extractErrObjFromResp(resendConfirmationEmailResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.emailNotFound,
			code: 400,
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(0)
	})

	it('should return success if input has correct values', async () => {
		const admin = await userUtils.createUserWithUnconfirmedEmail({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})
		if (!admin) return

		// Make expiration data expired
		await userRepository.updateUser(admin.id, {
			email_confirmation_code_expiration_date: subDays(new Date(), 5).toISOString(),
		})

		// Send another confirmation email
		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail(admin.email)
		const [resendConfirmationEmailResp] = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		// Check for successful answer and thet email adapter was run
		expect(resendConfirmationEmailResp.data).toBeTruthy()
		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(2)

		// Check if an expiration data is bigger than now for 3 hours
		const updatedAdmin = await userRepository.getUserById(admin.id)
		if (!updatedAdmin || !updatedAdmin.confirmationCodeExpirationDate) {
			throw new Error('User does not exist')
		}

		expect(+new Date(updatedAdmin.confirmationCodeExpirationDate)).toBeGreaterThan(
			+add(new Date(), { days: 2, hours: 23, minutes: 59 }),
		)
		expect(+new Date(updatedAdmin.confirmationCodeExpirationDate)).toBeLessThan(
			+add(new Date(), { days: 3, minutes: 1 }),
		)
	})

	it('should return an error if email is already confirmed', async () => {
		const admin = await userUtils.createUserWithConfirmedEmail({
			app,
			userRepository,
			role: UserRole.Admin,
			email: defAdminEmail,
			password: defAdminPassword,
		})
		if (!admin) return

		const resendConfirmationEmailMutation = queries.auth.resendConfirmationEmail(admin.email)
		const [resendConfirmationEmailResp] = await makeGraphQLReq(app, resendConfirmationEmailMutation)

		const firstErr = extractErrObjFromResp(resendConfirmationEmailResp)

		expect(firstErr).toStrictEqual({
			message: errorMessage.emailIsAlreadyConfirmed,
			code: 400,
		})

		expect(emailAdapter.sendEmailConfirmationMessage).toHaveBeenCalledTimes(1)
	})
})
