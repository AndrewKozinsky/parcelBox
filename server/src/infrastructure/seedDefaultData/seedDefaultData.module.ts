import { Global, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { CreateParcelBoxTypeHandler } from '../../features/parcelBoxType/CreateParcelBoxType.command'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../repo/parcelBoxType.repository'
import { SeedDefaultDataService } from './seedDefaultData.service'

const services = [PrismaService, SeedDefaultDataService]

const repositories = [ParcelBoxTypeRepository, ParcelBoxTypeQueryRepository]

const commandHandlers = [CreateParcelBoxTypeHandler]

@Global()
@Module({
	imports: [CqrsModule],
	providers: [...services, ...repositories, ...commandHandlers],
	exports: [],
})
export class SeedDefaultDataModule {}
