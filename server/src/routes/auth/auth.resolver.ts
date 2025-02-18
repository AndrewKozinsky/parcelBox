import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateAdminCommand } from '../../features/auth/CreateAdmin.command'
import RouteNames from '../../infrastructure/routeNames'
import { Admin } from './auth.schema'
import { CreateAdminInput } from './inputs/createAdmin.input'

@Resolver()
export class AuthResolver {
	constructor(private readonly commandBus: CommandBus) {}

	@Query(() => String)
	hello() {
		return 'Hello, world!'
	}

	@Mutation(() => Admin, { name: RouteNames.AUTH.REGISTER_ADMIN })
	@UsePipes(new ValidationPipe({ transform: true }))
	async registerUser(@Args('input') input: CreateAdminInput): Promise<Admin> {
		return await this.commandBus.execute(new CreateAdminCommand(input))
	}
}
