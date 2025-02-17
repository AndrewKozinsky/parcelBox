import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { CreateUserCommand } from '../../features/auth/CreateUser.command'
import RouteNames from '../../infrastructure/routeNames'
import { User } from './auth.schema'
import { CreateAdminInput } from './inputs/createAdmin.input'

@Resolver()
export class AuthResolver {
	constructor(private readonly commandBus: CommandBus) {}

	@Mutation(() => User, { name: RouteNames.AUTH.REGISTER_ADMIN })
	@UsePipes(new ValidationPipe({ transform: true }))
	async registerUser(@Args('input') input: CreateAdminInput) {
		await this.commandBus.execute(new CreateUserCommand(input))

		const newAdmin: User = {
			id: 2,
			email: input.email,
		}

		return newAdmin
	}
}
