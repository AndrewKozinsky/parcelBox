import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { SeedInitDataCommand } from '../../features/initData/SeedInitData.command'
import RouteNames from '../../infrastructure/routeNames'

@Controller()
export class InitDataController {
	constructor(private commandBus: CommandBus) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Post(RouteNames.INIT_DATA.SEED)
	async seedInitData() {
		return await this.commandBus.execute(new SeedInitDataCommand())
	}
}
