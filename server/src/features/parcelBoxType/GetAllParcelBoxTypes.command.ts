import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'

export class GetAllParcelBoxTypesCommand implements ICommand {
	constructor() {}
}

@CommandHandler(GetAllParcelBoxTypesCommand)
export class GetAllParcelBoxTypesHandler implements ICommandHandler<GetAllParcelBoxTypesCommand> {
	constructor(private parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository) {}

	async execute(command: GetAllParcelBoxTypesCommand) {
		return await this.parcelBoxTypeQueryRepository.getAllParcelBoxTypes()
	}
}
