import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CreateParcelBoxTypeCommand } from '../../features/parcelBoxType/CreateParcelBoxType.command'
import RouteNames from '../../infrastructure/routeNames'
import { AdminOutModel } from '../../models/admin/admin.out.model'
import { CreateParcelBoxTypeInput } from './inputs/createParcelBoxType.input'
import { parcelBoxTypeResolversDesc } from './resolverDescriptions'

@Resolver()
export class ParcelBoxTypeResolver {
	constructor(private commandBus: CommandBus) {}

	@Mutation(() => AdminOutModel, {
		name: RouteNames.PARCEL_BOX_TYPE.CREATE,
		description: parcelBoxTypeResolversDesc.create,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async create(@Args('input') input: CreateParcelBoxTypeInput): Promise<AdminOutModel> {
		return await this.commandBus.execute(new CreateParcelBoxTypeCommand(input))
	}
}
