import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CommandBus } from '@nestjs/cqrs'
import { CreateParcelBoxTypeCommand } from '../../features/parcelBoxType/CreateParcelBoxType.command'

@Injectable()
export class SeedDefaultDataService implements OnApplicationBootstrap {
	constructor(private readonly commandBus: CommandBus) {}

	async onApplicationBootstrap() {
		await this.commandBus.execute(new CreateParcelBoxTypeCommand({ name: 'hello!' }))
	}
}
