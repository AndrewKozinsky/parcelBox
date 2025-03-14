import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { PrismaService } from '../../db/prisma.service'
import { CreateParcelBoxHandler } from '../../features/parcelBox/CreateParcelBox.command'
import { DeleteParcelBoxHandler } from '../../features/parcelBox/DeleteParcelBox.command'
import { GetParcelBoxesOfUserHandler } from '../../features/parcelBox/GetParcelBoxesOfUser.command'
import { CellRepository } from '../../repo/cell.repository'
import { CellTypeRepository } from '../../repo/cellType.repository'
import { LocationRepository } from '../../repo/location.repository'
import { ParcelBoxQueryRepository } from '../../repo/parcelBox.queryRepository'
import { ParcelBoxRepository } from '../../repo/parcelBox.repository'
import { UserQueryRepository } from '../../repo/user.queryRepository'
import { ParcelBoxIdValidation } from '../common/inputs'
import { ParcelBoxResolver } from './parcelBox.resolver'

const services = [PrismaService]

const repositories = [
	CellTypeRepository,
	CellRepository,
	ParcelBoxRepository,
	ParcelBoxQueryRepository,
	LocationRepository,
	UserQueryRepository,
]

const commandHandlers = [CreateParcelBoxHandler, GetParcelBoxesOfUserHandler, DeleteParcelBoxHandler]

const resolvers = [ParcelBoxResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...services, ...repositories, ...commandHandlers, ...resolvers, ParcelBoxIdValidation],
})
export class ParcelBoxModule {}
