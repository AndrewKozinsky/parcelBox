import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CreateCellTypeCommand } from '../../features/cellType/CreateCellType.command'
import RouteNames from '../../infrastructure/routeNames'
import { CellTypeOutModel } from '../../models/cellType/cellType.out.model'
import { CreateCellTypeInput } from './inputs/createCellType.input'
import { cellTypeResolversDesc } from './resolverDescriptions'

@Resolver()
export class CellTypeResolver {
	constructor(private commandBus: CommandBus) {}

	@Mutation(() => CellTypeOutModel, {
		name: RouteNames.CELL_TYPE.CREATE,
		description: cellTypeResolversDesc.create,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async create(@Args('input') input: CreateCellTypeInput): Promise<CellTypeOutModel> {
		return await this.commandBus.execute(new CreateCellTypeCommand(input))
		/*return {
			id: 1,
			name: '1',
			width: 1,
			height: 1,
			depth: 1,
			parcelBoxTypeId: 1,
		}*/
	}
}
