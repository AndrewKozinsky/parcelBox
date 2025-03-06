import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { CreateParcelBoxHandler } from '../../features/parcelBox/CreateParcelBox.command'
import { CellRepository } from '../../repo/cell.repository'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { ParcelBoxQueryRepository } from '../../repo/parcelBox.queryRepository'
import { ParcelBoxRepository } from '../../repo/parcelBox.repository'
import { ParcelBoxResolver } from './parcelBox.resolver'

const services = [PrismaService]

const repositories = [CellTypeRepository, CellRepository, ParcelBoxRepository, ParcelBoxQueryRepository]

const commandHandlers = [CreateParcelBoxHandler]

const resolvers = [ParcelBoxResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers],
})
export class ParcelBoxModule {}
