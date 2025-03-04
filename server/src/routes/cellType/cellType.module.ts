import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { CreateCellTypeHandler } from '../../features/cellType/CreateCellType.command'
import { CreateParcelBoxTypeHandler } from '../../features/parcelBoxType/CreateParcelBoxType.command'
import { CellTypeQueryRepository } from '../../repo/cellType.queryRepository'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'
import { ParcelBoxTypeRepository } from '../../repo/parcelBoxType.repository'
import { CellTypeResolver } from './cellType.resolver'

const services = [PrismaService]

const repositories = [CellTypeRepository, CellTypeQueryRepository]

const commandHandlers = [CreateCellTypeHandler]

const resolvers = [CellTypeResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class CellTypeModule {}
