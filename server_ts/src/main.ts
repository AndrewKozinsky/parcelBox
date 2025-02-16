import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MainConfigService } from './config/mainConfig.service'
import { applyAppSettings } from './infrastructure/applyAppSettings'
import { GraphQLValidationFilter } from './infrastructure/graphqlException.filter'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	applyAppSettings(app)

	const mainConfig = app.get(MainConfigService)
	await app.listen(mainConfig.get().port)
}

bootstrap()
