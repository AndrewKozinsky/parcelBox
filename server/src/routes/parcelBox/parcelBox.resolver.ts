import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CreateParcelBoxCommand } from '../../features/parcelBox/CreateParcelBox.command'
import RouteNames from '../../infrastructure/routeNames'
import { ParcelBoxOutModel } from '../../models/parcelBox/parcelBox.out.model'
import { CreateParcelBoxInput } from './inputs/createParcelBox.input'
import { parcelBoxResolversDesc } from './resolverDescriptions'

@Resolver()
export class ParcelBoxResolver {
	constructor(private commandBus: CommandBus) {}

	@Mutation(() => ParcelBoxOutModel, {
		name: RouteNames.PARCEL_BOX.CREATE,
		description: parcelBoxResolversDesc.create,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async create(@Args('input') input: CreateParcelBoxInput): Promise<ParcelBoxOutModel> {
		return await this.commandBus.execute(new CreateParcelBoxCommand(input))
	}
}
