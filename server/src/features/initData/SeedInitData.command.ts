import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'

export class SeedInitDataCommand implements ICommand {
	constructor() {}
}

@CommandHandler(SeedInitDataCommand)
export class SeedInitDataHandler implements ICommandHandler<SeedInitDataCommand> {
	constructor() {}

	async execute(command: SeedInitDataCommand) {
		return null
	}
}
