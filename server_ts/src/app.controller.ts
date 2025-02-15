import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { MainConfigService } from './config/mainConfig.service'

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private mainConfig: MainConfigService,
	) {}

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}
}
