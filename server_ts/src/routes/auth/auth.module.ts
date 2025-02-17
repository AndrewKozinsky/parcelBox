import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { CreateUserHandler } from '../../features/auth/CreateUser.command'
import { EmailAdapterService } from '../../infrastructure/email-adapter/email-adapter.service'
import { UserRepository } from '../../repo/user.repository'
import { AuthResolver } from './auth.resolver'

const services = [PrismaService, EmailAdapterService]

const repositories = [UserRepository]

const commandHandlers = [CreateUserHandler]

const resolvers = [AuthResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class AuthModule {}
