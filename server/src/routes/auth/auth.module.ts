import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { ConfirmEmailHandler } from '../../features/auth/ConfirmEmail.command'
import { CreateAdminHandler } from '../../features/auth/CreateAdmin.command'
import { CreateRefreshTokenHandler } from '../../features/auth/CreateRefreshToken.command'
import { CreateSenderHandler } from '../../features/auth/CreateSender.command'
import { LoginHandler } from '../../features/auth/Login.command'
import { EmailAdapterService } from '../../infrastructure/emailAdapter/email-adapter.service'
import { DevicesRepository } from '../../repo/devices.repository'
import { SenderQueryRepository } from '../../repo/sender.queryRepository'
import { SenderRepository } from '../../repo/sender.repository'
import { UserQueryRepository } from '../../repo/user.queryRepository'
import { UserRepository } from '../../repo/user.repository'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'

const services = [PrismaService, EmailAdapterService, AuthService]

const repositories = [UserRepository, UserQueryRepository, SenderRepository, SenderQueryRepository, DevicesRepository]

const commandHandlers = [
	CreateAdminHandler,
	CreateSenderHandler,
	ConfirmEmailHandler,
	LoginHandler,
	CreateRefreshTokenHandler,
]

const resolvers = [AuthResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class AuthModule {}
