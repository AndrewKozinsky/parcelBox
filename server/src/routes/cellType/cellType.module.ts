import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { CreateCellTypeHandler } from '../../features/cellType/CreateCellType.command'
import { CellTypeQueryRepository } from '../../repo/cellType.queryRepository'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { ParcelBoxTypeQueryRepository } from '../../repo/parcelBoxType.queryRepository'
import { CellTypeResolver } from './cellType.resolver'
import { ParcelBoxTypeIdValidation } from './inputs/createCellType.input'

const services = [PrismaService]

const repositories = [CellTypeRepository, CellTypeQueryRepository, ParcelBoxTypeQueryRepository]

const commandHandlers = [CreateCellTypeHandler]

const resolvers = [CellTypeResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers, ParcelBoxTypeIdValidation],
})
export class CellTypeModule {}
