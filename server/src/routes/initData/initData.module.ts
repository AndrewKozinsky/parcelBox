import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { CreateParcelBoxTypeHandler } from '../../features/parcelBoxType/CreateParcelBoxType.command'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../repo/parcelBoxType.repository'
import { InitDataService } from './initData.service'

const services = [PrismaService]

const repositories = [ParcelBoxTypeRepository, ParcelBoxTypeQueryRepository]

const commandHandlers = [CreateParcelBoxTypeHandler]

const resolvers = [InitDataService]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class InitDataModule {}
