import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CreateAdminCommand } from '../../features/auth/CreateAdmin.command'
import { CreateSenderCommand } from '../../features/auth/CreateSender.command'
import { ConfirmEmailCommand } from '../../features/auth/ConfirmEmailCommand'
import RouteNames from '../../infrastructure/routeNames'
import { AdminOutModel } from '../../models/admin/admin.out.model'
import { LoginOutModel } from '../../models/auth/auth.out.model'
import { SenderOutModel } from '../../models/sender/sender.out.model'
import { ConfirmEmailInput } from './inputs/confirmEmail.input'
import { CreateAdminInput } from './inputs/createAdmin.input'
import { CreateSenderInput } from './inputs/createSender.input'
import { LoginInput } from './inputs/login.input'
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
		return await this.commandBus.execute(new ConfirmEmailCommand(input))
	}

	@Mutation(() => LoginOutModel, {
		name: RouteNames.AUTH.LOGIN,
		description: authResolversDesc.login,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async login(@Args('input') input: LoginInput, @Context() context: { req: Request }): Promise<LoginOutModel> {
		// Get the request object from the context
		const request = context.req

		return {
			accessToken: 'my accessToken',
			user: {
				id: 1,
				email: 'email@email.com',
			},
		}

		// const clientIP = this.browserService.getClientIP(req)
		// const clientName = this.browserService.getClientName(req)
		/*const commandRes = await this.commandBus.execute<
			any,
			ReturnType<typeof LoginHandler.prototype.execute>
		>(new LoginCommand(body, clientIP, clientName))*/
		// const { refreshTokenStr, user } = commandRes
		// this.authService.setRefreshTokenInCookie(res, refreshTokenStr)
		/*const respData: SWLoginRouteOut = createSuccessResp<LoginOutModel>(
			authRoutesConfig.login,
			{
				accessToken: this.jwtAdapter.createAccessTokenStr(user.id),
				user,
			},
		)*/
		// res.status(HttpStatus.OK).send(respData)
		// ----
		// return await this.commandBus.execute(new LoginCommand(input))
	}
}
