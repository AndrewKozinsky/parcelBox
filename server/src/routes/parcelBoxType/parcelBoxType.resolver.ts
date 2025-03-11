import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateParcelBoxTypeCommand } from '../../features/parcelBoxType/CreateParcelBoxType.command'
import { GetAllParcelBoxTypesCommand } from '../../features/parcelBoxType/GetAllParcelBoxTypes.command'
import RouteNames from '../../infrastructure/routeNames'
import { ParcelBoxTypeOutModel } from '../../models/parcelBoxType/parcelBoxType.out.model'
import { CreateParcelBoxTypeInput } from './inputs/createParcelBoxType.input'
import { parcelBoxTypeResolversDesc } from './resolverDescriptions'

@Resolver()
export class ParcelBoxTypeResolver {
	constructor(private commandBus: CommandBus) {}

	@Mutation(() => ParcelBoxTypeOutModel, {
		name: RouteNames.PARCEL_BOX_TYPE.CREATE,
		description: parcelBoxTypeResolversDesc.create,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async create(@Args('input') input: CreateParcelBoxTypeInput): Promise<ParcelBoxTypeOutModel> {
		return await this.commandBus.execute(new CreateParcelBoxTypeCommand(input))
	}

	@Query(() => [ParcelBoxTypeOutModel], {
		name: RouteNames.PARCEL_BOX_TYPE.GET_ALL,
		description: parcelBoxTypeResolversDesc.getAll,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getAll(): Promise<ParcelBoxTypeOutModel[]> {
		return await this.commandBus.execute(new GetAllParcelBoxTypesCommand())
	}
}
