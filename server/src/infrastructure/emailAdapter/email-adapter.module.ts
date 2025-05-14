import { Global, Module } from '@nestjs/common'
import { EmailAdapterService, EmailAdapterServiceMock } from './email-adapter.service'
import { MainConfigService } from '../config/mainConfig.service'

const emailServiceProvider = {
	provide: EmailAdapterService,
	useFactory: (mainConfigService: MainConfigService) => {
		return mainConfigService.get().mode === 'testing'
			? new EmailAdapterServiceMock()
			: new EmailAdapterService(mainConfigService)
	},
	inject: [MainConfigService],
}

@Global()
@Module({
	providers: [emailServiceProvider],
	exports: [EmailAdapterService],
})
export class EmailAdapterModule {}
