import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { ConfirmEmailHandler } from '../../features/auth/ConfirmEmailCommand'
import { CreateAdminHandler } from '../../features/auth/CreateAdmin.command'
import { CreateSenderHandler } from '../../features/auth/CreateSender.command'
import { EmailAdapterService } from '../../infrastructure/email-adapter/email-adapter.service'
import { SenderQueryRepository } from '../../repo/sender.queryRepository'
import { SenderRepository } from '../../repo/sender.repository'
import { UserQueryRepository } from '../../repo/user.queryRepository'
import { UserRepository } from '../../repo/user.repository'
import { AuthResolver } from './auth.resolver'

const services = [PrismaService, EmailAdapterService]

const repositories = [UserRepository, UserQueryRepository, SenderRepository, SenderQueryRepository]

const commandHandlers = [CreateAdminHandler, CreateSenderHandler, ConfirmEmailHandler]

const resolvers = [AuthResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class AuthModule {}
