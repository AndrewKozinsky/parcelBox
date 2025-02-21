import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { UserRepository } from '../repo/user.repository'
import { GraphQLValidationFilter } from './exceptions/graphqlException.filter'
import { JwtAdapterService } from './jwtAdapter/jwtAdapter.service'
import { SetReqUserMiddleware } from './middlewares/setReqUser.middleware'

export function applyAppSettings(app: INestApplication) {
	app.use(async (req: Request, res: Response, next: NextFunction) => {
		const jwtService = await app.resolve(JwtAdapterService)
		const userRepository = await app.resolve(UserRepository)

		const userMiddleware = new SetReqUserMiddleware(jwtService, userRepository)
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
