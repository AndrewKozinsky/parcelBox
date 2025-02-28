import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import { applyAppSettings } from '../../src/infrastructure/applyAppSettings'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'

export async function createApp(emailAdapter: EmailAdapterService) {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	})
		.overrideProvider(EmailAdapterService)
		.useValue({
			sendEmailConfirmationMessage: jest.fn().mockResolvedValue('Mocked Email Response'),
			sendEmail: jest.fn().mockResolvedValue('Mocked Email Response'),
			sendPasswordRecoveryMessage: jest.fn().mockResolvedValue('Mocked Email Response'),
		})
		.compile()

	const app = moduleFixture.createNestApplication()
	await applyAppSettings(app)
	await app.init()

	emailAdapter = moduleFixture.get<EmailAdapterService>(EmailAdapterService)

	return {
		app,
		emailAdapter,
	}
}
