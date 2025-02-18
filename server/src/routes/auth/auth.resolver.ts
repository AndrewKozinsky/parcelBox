import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateAdminCommand } from '../../features/auth/CreateAdmin.command'
import { CreateSenderCommand } from '../../features/auth/CreateSender.command'
import RouteNames from '../../infrastructure/routeNames'
import { Admin, Sender } from './auth.schema'
import { CreateAdminInput } from './inputs/createAdmin.input'
import { CreateSenderInput } from './inputs/createSender.input'
import { authResolversDesc } from './resolverDescriptions'

@Resolver()
export class AuthResolver {
	constructor(private readonly commandBus: CommandBus) {}

	@Query(() => String, { description: authResolversDesc.hello })
	hello() {
		return 'Hello, world!'
	}

	@Mutation(() => Admin, {
		name: RouteNames.AUTH.REGISTER_ADMIN,
		description: authResolversDesc.registerAdmin,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async registerAdmin(@Args('input') input: CreateAdminInput): Promise<Admin> {
		return await this.commandBus.execute(new CreateAdminCommand(input))
	}

	@Mutation(() => Admin, {
		name: RouteNames.AUTH.REGISTER_SENDER,
		description: authResolversDesc.registerSender,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async registerSender(@Args('input') input: CreateSenderInput): Promise<Sender> {
		return await this.commandBus.execute(new CreateSenderCommand(input))
	}
}
