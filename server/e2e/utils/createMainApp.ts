import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../src/app.module'
import { AddressAdapterService } from '../../src/infrastructure/addressAdapter/address-adapter.service'
import { applyAppSettings } from '../../src/infrastructure/applyAppSettings'
import { EmailAdapterService } from '../../src/infrastructure/emailAdapter/email-adapter.service'

export async function createApp(props: { emailAdapter: EmailAdapterService }) {
	const moduleFixture: TestingModule = await Test.createTestingModule({
		imports: [AppModule],
	})
		.overrideProvider(EmailAdapterService)
		.useValue({
			sendEmailConfirmationMessage: jest.fn().mockResolvedValue('Mocked Email Response'),
			sendEmail: jest.fn().mockResolvedValue('Mocked Email Response'),
			sendPasswordRecoveryMessage: jest.fn().mockResolvedValue('Mocked Email Response'),
		})
		.overrideProvider(AddressAdapterService)
		.useValue({
			makeSuggestions: jest
				.fn()
				.mockResolvedValue([
					'г Оренбург, Северный проезд',
					'г Оренбург, Северный проезд, д 1',
					'г Оренбург, Северный проезд, д 2',
					'г Оренбург, Северный проезд, д 3',
					'г Оренбург, Северный проезд, д 4',
					'г Оренбург, Северный проезд, д 5',
					'г Оренбург, Северный проезд, д 6',
					'г Оренбург, Северный проезд, д 7',
					'г Оренбург, Северный проезд, д 8',
					'г Оренбург, Северный проезд, д 8А',
				]),
		})
		.compile()

	const app = moduleFixture.createNestApplication()
	await applyAppSettings(app)
	await app.init()

	props.emailAdapter = moduleFixture.get<EmailAdapterService>(EmailAdapterService)

	return {
		app,
		moduleFixture,
		emailAdapter: props.emailAdapter,
	}
}
