import { BadRequestException, Controller, Delete, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common'
import { Response } from 'express'
import { DbService } from '../../db/dbService'
import { OnlyDevModeGuard } from '../../infrastructure/guards/onlyDevMode.guard'
import RouteNames from '../../infrastructure/routeNames'

@Controller()
export class TestsController {
	constructor(private dbService: DbService) {}

	@UseGuards(OnlyDevModeGuard)
	@Delete(RouteNames.TESTING.ALL_DATA)
	async deleteAllData(@Res() res: Response) {
		const isDropped = await this.dbService.drop()

		if (isDropped) {
			res.sendStatus(HttpStatus.NO_CONTENT)
			return
		}

		throw new BadRequestException()
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(OnlyDevModeGuard)
	@Post()
	async seedTestData() {
		//
	}
}
