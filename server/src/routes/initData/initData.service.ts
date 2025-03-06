import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { SeedInitDataCommand } from '../../features/initData/SeedInitData.command'

@Injectable()
export class InitDataService implements OnApplicationBootstrap {
	constructor(private commandBus: CommandBus) {}

	// This method run after server starts
	async onApplicationBootstrap() {
		return await this.commandBus.execute(new SeedInitDataCommand())
	}
}
