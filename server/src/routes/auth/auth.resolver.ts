import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateAdminCommand } from '../../features/auth/CreateAdmin.command'
import { CreateSenderCommand } from '../../features/auth/CreateSender.command'
import { ConfirmEmailCommand } from '../../features/auth/ConfirmEmailCommand'
import RouteNames from '../../infrastructure/routeNames'
import { AdminOutModel } from '../../models/admin/admin.out.model'
import { SenderOutModel } from '../../models/sender/sender.out.model'
import { CreateAdminInput } from './inputs/createAdmin.input'
import { ConfirmEmailInput, CreateSenderInput } from './inputs/createSender.input'
import { authResolversDesc } from './resolverDescriptions'

@Resolver()
export class AuthResolver {
	constructor(private readonly commandBus: CommandBus) {}

	@Mutation(() => AdminOutModel, {
		name: RouteNames.AUTH.REGISTER_ADMIN,
		description: authResolversDesc.registerAdmin,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async registerAdmin(@Args('input') input: CreateAdminInput): Promise<AdminOutModel> {
		return await this.commandBus.execute(new CreateAdminCommand(input))
	}

	@Mutation(() => SenderOutModel, {
		name: RouteNames.AUTH.REGISTER_SENDER,
		description: authResolversDesc.registerSender,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async registerSender(@Args('input') input: CreateSenderInput): Promise<SenderOutModel> {
		return await this.commandBus.execute(new CreateSenderCommand(input))
	}

	@Query(() => Boolean, {
		name: RouteNames.AUTH.CONFIRM_EMAIL,
		description: authResolversDesc.confirmEmail,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async confirmEmail(@Args('input') input: ConfirmEmailInput) {
		await this.commandBus.execute(new ConfirmEmailCommand(input))
		return true
	}
}
