import { Injectable } from '@nestjs/common'
import { PrismaService } from '../db/prisma.service'

@Injectable()
export class CellTypeRepository {
	constructor(private prisma: PrismaService) {}
}
