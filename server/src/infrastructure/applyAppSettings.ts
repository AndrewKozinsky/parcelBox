import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common'
import { useContainer } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import * as cookieParser from 'cookie-parser'
import { AppModule } from '../app.module'
import { MainConfigService } from './config/mainConfig.service'
import { UserRepository } from '../repo/user.repository'
import { GraphQLValidationFilter } from './exceptions/graphqlException.filter'
import { JwtAdapterService } from './jwtAdapter/jwtAdapter.service'
import { SetUserIntoReqMiddleware } from './middlewares/setUserIntoReq.middleware'

export async function applyAppSettings(app: INestApplication) {
	app.use(cookieParser())

	// Enable NestJS DI for class-validator
	useContainer(app.select(AppModule), { fallbackOnErrors: true })

	const mainConfig = await app.resolve(MainConfigService)

	if (['testing', 'development'].includes(mainConfig.get().mode)) {
		app.enableCors({
			origin: 'http://localhost:3001', // Your frontend URL
			credentials: true, // Allow credentials (cookies, authorization headers)
		})
	}

	app.use(async (req: Request, res: Response, next: NextFunction) => {
		const jwtService = await app.resolve(JwtAdapterService)
		const userRepository = await app.resolve(UserRepository)
		const mainConfig = await app.resolve(MainConfigService)

		const userMiddleware = new SetUserIntoReqMiddleware(jwtService, userRepository, mainConfig)
		await userMiddleware.use(req, res, next)
	})

	// Thus ensuring all endpoints are protected from receiving incorrect data.
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			stopAtFirstError: true,
			exceptionFactory: (errors) => {
				const errorsForResponse: Record<string, string>[] = []

				errors.forEach((e) => {
					// @ts-ignore
					const constraintsKeys = Object.keys(e.constraints)
					constraintsKeys.forEach((cKey) => {
						// @ts-ignore
						errorsForResponse.push({ message: e.constraints[cKey], field: e.property })
					})
				})

				throw new BadRequestException(errorsForResponse)
			},
		}),
	)

	app.useGlobalFilters(new GraphQLValidationFilter())
}
