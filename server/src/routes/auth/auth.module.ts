import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { ConfirmEmailHandler } from '../../features/auth/ConfirmEmail.command'
import { CreateAdminHandler } from '../../features/auth/CreateAdmin.command'
import { CreateRefreshTokenHandler } from '../../features/auth/CreateRefreshToken.command'
import { CreateSenderHandler } from '../../features/auth/CreateSender.command'
import { GenerateAccessAndRefreshTokensHandler } from '../../features/auth/GenerateAccessAndRefreshTokens.command'
import { GetAdminOrSenderByIdHandler } from '../../features/auth/GetAdminOrSenderById.command'
import { LoginHandler } from '../../features/auth/Login.command'
import { LogoutHandler } from '../../features/auth/Logout.command'
import { ResendConfirmationEmailHandler } from '../../features/auth/ResendConfirmationEmail.command'
import { EmailAdapterService } from '../../infrastructure/emailAdapter/email-adapter.service'
import { AdminQueryRepository } from '../../repo/admin.queryRepository'
import { AdminRepository } from '../../repo/admin.repository'
import { DevicesRepository } from '../../repo/devices.repository'
import { SenderQueryRepository } from '../../repo/sender.queryRepository'
import { SenderRepository } from '../../repo/sender.repository'
import { UserQueryRepository } from '../../repo/user.queryRepository'
import { UserRepository } from '../../repo/user.repository'
import { AuthResolver } from './auth.resolver'

const services = [PrismaService, EmailAdapterService]

const repositories = [
	UserRepository,
	UserQueryRepository,
	SenderRepository,
	SenderQueryRepository,
	AdminRepository,
	AdminQueryRepository,
	DevicesRepository,
]

const commandHandlers = [
	CreateAdminHandler,
	CreateSenderHandler,
	ConfirmEmailHandler,
	LoginHandler,
	CreateRefreshTokenHandler,
	ResendConfirmationEmailHandler,
	LogoutHandler,
	GenerateAccessAndRefreshTokensHandler,
	GetAdminOrSenderByIdHandler,
]

const resolvers = [AuthResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class AuthModule {}
