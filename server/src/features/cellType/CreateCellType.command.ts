import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customErrors'
import { ErrorCode } from '../../infrastructure/exceptions/errorCode'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
import { CellTypeQueryRepository } from '../../repo/cellType.queryRepository'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { CreateCellTypeInput } from '../../routes/cellType/inputs/createCellType.input'

export class CreateCellTypeCommand implements ICommand {
	constructor(public createCellTypeInput: CreateCellTypeInput) {}
}

@CommandHandler(CreateCellTypeCommand)
export class CreateCellTypeHandler implements ICommandHandler<CreateCellTypeCommand> {
	constructor(
		private cellTypeRepository: CellTypeRepository,
		private cellTypeQueryRepository: CellTypeQueryRepository,
	) {}

	async execute(command: CreateCellTypeCommand) {
		const { createCellTypeInput } = command

		const createdBox = await this.cellTypeRepository.createCellType(createCellTypeInput)
		if (!createdBox) {
			throw new CustomGraphQLError(errorMessage.cellTypeDidNotCreated, ErrorCode.InternalServerError_500)
		}

		return await this.cellTypeQueryRepository.getCellTypeById(createdBox.id)
	}
}
