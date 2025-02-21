import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { MainConfigService } from '../../config/mainConfig.service'
import { CreateAdminCommand } from '../../features/auth/CreateAdmin.command'
import { CreateSenderCommand } from '../../features/auth/CreateSender.command'
import { ConfirmEmailCommand } from '../../features/auth/ConfirmEmail.command'
import { LoginCommand } from '../../features/auth/Login.command'
import { LogoutCommand } from '../../features/auth/Logout.command'
import { ResendConfirmationEmailCommand } from '../../features/auth/ResendConfirmationEmail.command'
import { BrowserService } from '../../infrastructure/browserService/browser.service'
import { CheckAccessTokenGuard } from '../../infrastructure/guards/checkAccessToken.guard'
import { CheckDeviceRefreshTokenGuard } from '../../infrastructure/guards/checkDeviceRefreshToken.guard'
import { JwtAdapterService } from '../../infrastructure/jwtAdapter/jwtAdapter.service'
import RouteNames from '../../infrastructure/routeNames'
import { AdminOutModel } from '../../models/admin/admin.out.model'
import { LoginOutModel } from '../../models/auth/auth.out.model'
import { SenderOutModel } from '../../models/sender/sender.out.model'
import { AuthService } from './auth.service'
import { ConfirmEmailInput } from './inputs/confirmEmail.input'
import { CreateAdminInput } from './inputs/createAdmin.input'
import { CreateSenderInput } from './inputs/createSender.input'
import { LoginInput } from './inputs/login.input'
import { ResendConfirmationEmailInput } from './inputs/resendConfirmationEmail.input'
import { authResolversDesc } from './resolverDescriptions'
import { Request, Response } from 'express'

@Resolver()
export class AuthResolver {
	constructor(
		private commandBus: CommandBus,
		private browserService: BrowserService,
		private authService: AuthService,
		private jwtAdapter: JwtAdapterService,
		private mainConfig: MainConfigService,
	) {}

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
	async login(
		@Args('input') input: LoginInput,
		@Context('req') request: Request,
		@Context('res') response: Response,
	): Promise<LoginOutModel> {
		const clientIP = this.browserService.getClientIP(request)
		const clientName = this.browserService.getClientName(request)

		const commandRes = await this.commandBus.execute(new LoginCommand(input, clientIP, clientName))
		const { refreshTokenStr, user } = commandRes

		this.authService.setRefreshTokenInCookie(response, refreshTokenStr)

		return {
			accessToken: this.jwtAdapter.createAccessTokenStr(user.id),
			user,
		}
	}

	@Mutation(() => Boolean, {
		name: RouteNames.AUTH.RESEND_CONFIRMATION_EMAIL,
		description: authResolversDesc.resendConfirmationEmail,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async resendConfirmationEmail(@Args('input') input: ResendConfirmationEmailInput) {
		return await this.commandBus.execute(new ResendConfirmationEmailCommand(input.email))
	}

	// @UseGuards(CheckAccessTokenGuard)
	@UseGuards(CheckDeviceRefreshTokenGuard)
	@Mutation(() => Boolean, {
		name: RouteNames.AUTH.LOGOUT,
		description: authResolversDesc.logout,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async logout(@Context('req') request: Request, @Context('res') response: Response) {
		/*const refreshToken = this.browserService.getRefreshTokenStrFromReq(request)

		await this.commandBus.execute(new LogoutCommand(refreshToken))

		response.clearCookie(this.mainConfig.get().refreshToken.name)*/
		return true
	}
}
