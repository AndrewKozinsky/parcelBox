import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { CreateParcelBoxTypeCommand } from '../../features/parcelBoxType/CreateParcelBoxType.command'

@Injectable()
export class InitDataService implements OnApplicationBootstrap {
	constructor(private commandBus: CommandBus) {}

	async onApplicationBootstrap() {
		return await this.commandBus.execute(new CreateParcelBoxTypeCommand({ name: '333' }))
	}
}
