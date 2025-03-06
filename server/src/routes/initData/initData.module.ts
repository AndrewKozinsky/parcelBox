import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { SeedInitDataHandler } from '../../features/initData/SeedInitData.command'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { ParcelBoxTypeRepository } from '../../repo/parcelBoxType.repository'
import { InitDataController } from './initData.controller'
import { InitDataService } from './initData.service'

const services = [PrismaService]

const repositories = [ParcelBoxTypeRepository, CellTypeRepository]

const commandHandlers = [SeedInitDataHandler]

const resolvers = [InitDataService]

@Module({
	imports: [CqrsModule],
	controllers: [InitDataController],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class InitDataModule {}
