import { ICommand, ICommandHandler, QueryHandler } from '@nestjs/cqrs'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'

export class GetAllParcelBoxTypesCommand implements ICommand {
	constructor() {}
}

@QueryHandler(GetAllParcelBoxTypesCommand)
export class GetAllParcelBoxTypesHandler implements ICommandHandler<GetAllParcelBoxTypesCommand> {
	constructor(private parcelBoxTypeQueryRepository: ParcelBoxTypeQueryRepository) {}

	async execute(command: GetAllParcelBoxTypesCommand) {
		return await this.parcelBoxTypeQueryRepository.getAllParcelBoxTypes()
	}
}
