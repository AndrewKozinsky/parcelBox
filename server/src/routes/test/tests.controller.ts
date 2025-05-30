import {
	BadRequestException,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query,
	Res,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Response } from 'express'
import { DbService } from '../../db/dbService'
import { GetServiceUserCommand } from '../../features/test/GetServiceUser.command'
import { SeedTestDataCommand } from '../../features/test/SeedTestData.command'
import { OnlyDevOrTestingModeGuard } from '../../infrastructure/guards/onlyDevMode.guard'
import RouteNames from '../../infrastructure/routeNames'
import { GetUserQueries } from '../../models/test/test.input.model'

@Controller()
export class TestsController {
	constructor(
		private commandBus: CommandBus,
		private dbService: DbService,
	) {}

	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(OnlyDevOrTestingModeGuard)
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
	@UseGuards(OnlyDevOrTestingModeGuard)
	@Post(RouteNames.TESTING.SEED)
	async seedTestData() {
		await this.commandBus.execute(new SeedTestDataCommand())
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(OnlyDevOrTestingModeGuard)
	@Get(RouteNames.TESTING.USER)
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
	async getUser(@Query() query: GetUserQueries) {
		return await this.commandBus.execute(new GetServiceUserCommand(query.email))
	}
}
