import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Request } from 'express'
import { CreateParcelBoxCommand } from '../../features/parcelBox/CreateParcelBox.command'
import { DeleteParcelBoxCommand } from '../../features/parcelBox/DeleteParcelBox.command'
import { GetParcelBoxesOfUserCommand } from '../../features/parcelBox/GetParcelBoxesOfUser.command'
import { CheckAccessTokenGuard } from '../../infrastructure/guards/checkAccessToken.guard'
import RouteNames from '../../infrastructure/routeNames'
import { ParcelBoxOutModel } from '../../models/parcelBox/parcelBox.out.model'
import { CreateParcelBoxInput } from './inputs/createParcelBox.input'
import { DeleteParcelBoxInput } from './inputs/deleteParcelBox.input'
import { parcelBoxResolversDesc } from './resolverDescriptions'

@Resolver()
export class ParcelBoxResolver {
	constructor(private commandBus: CommandBus) {}

	@UseGuards(CheckAccessTokenGuard)
	@Mutation(() => ParcelBoxOutModel, {
		name: RouteNames.PARCEL_BOX.CREATE,
		description: parcelBoxResolversDesc.create,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async create(
		@Context('req') request: Request,
		@Args('input') input: CreateParcelBoxInput,
	): Promise<ParcelBoxOutModel> {
		return await this.commandBus.execute(
			new CreateParcelBoxCommand({
				userId: request.user!.id,
				...input,
			}),
		)
	}

	@UseGuards(CheckAccessTokenGuard)
	@Query(() => [ParcelBoxOutModel], {
		name: RouteNames.PARCEL_BOX.GET_MINE,
		description: parcelBoxResolversDesc.getMyParcelBoxes,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getMyParcelBoxes(@Context('req') request: Request) {
		return await this.commandBus.execute(new GetParcelBoxesOfUserCommand(request.user.id))
	}

	@Mutation(() => Boolean, {
		name: RouteNames.PARCEL_BOX.DELETE,
		description: parcelBoxResolversDesc.delete,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async delete(@Args('input') input: DeleteParcelBoxInput) {
		return await this.commandBus.execute(new DeleteParcelBoxCommand(input))
	}
}
