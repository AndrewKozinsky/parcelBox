import { BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateAdminCommand } from '../../features/auth/CreateAdmin.command'
import { CustomGraphQLError } from '../../infrastructure/exceptions/customGraphQLError'
import { errorMessage } from '../../infrastructure/exceptions/errorMessage'
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
	async registerUser(@Args('input') input: CreateAdminInput) {
		throw new CustomGraphQLError('Email is already registered', 400)

		// await this.commandBus.execute(new CreateAdminCommand(input))

		const newAdmin: Admin = {
			id: 2,
			email: input.email,
			password: input.password,
		}

		return newAdmin
	}
}
