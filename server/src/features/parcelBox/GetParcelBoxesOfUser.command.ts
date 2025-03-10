import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { ParcelBoxQueryRepository } from '../../repo/parcelBox.queryRepository'

export class GetParcelBoxesOfUserCommand implements ICommand {
	constructor(public userId: number) {}
}

@CommandHandler(GetParcelBoxesOfUserCommand)
export class GetParcelBoxesOfUserHandler implements ICommandHandler<GetParcelBoxesOfUserCommand> {
	constructor(private parcelBoxQueryRepository: ParcelBoxQueryRepository) {}

	async execute(command: GetParcelBoxesOfUserCommand) {
		const { userId } = command
		return await this.parcelBoxQueryRepository.getParcelBoxesByUserId(userId)
	}
}
