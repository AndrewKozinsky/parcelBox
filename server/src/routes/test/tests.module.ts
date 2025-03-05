import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { DbService } from '../../db/dbService'
import { GetServiceUserHandler } from '../../features/test/GetServiceUser.command'
import { SeedTestDataHandler } from '../../features/test/SeedTestData.command'
import { UserRepository } from '../../repo/user.repository'
import { TestsController } from './tests.controller'
import { PrismaService } from '../../db/prisma.service'

const commandHandlers = [SeedTestDataHandler, GetServiceUserHandler]

const repositories = [UserRepository]

@Module({
	imports: [CqrsModule],
	controllers: [TestsController],
	providers: [DbService, PrismaService, ...commandHandlers, ...repositories],
})
export class TestsModule {}
