import { BadRequestException, Controller, Delete, HttpStatus, Res } from '@nestjs/common'
import { Response } from 'express'
import { DbService } from '../../db/dbService'
import RouteNames from '../../infrastructure/routeNames'

@Controller()
export class TestsController {
	constructor(private dbService: DbService) {}

	@Delete(RouteNames.TESTING.ALL_DATA)
	async deleteAllData(@Res() res: Response) {
		const isDropped = await this.dbService.drop()

		if (isDropped) {
			res.sendStatus(HttpStatus.NO_CONTENT)
			return
		}

		throw new BadRequestException()
	}
}
