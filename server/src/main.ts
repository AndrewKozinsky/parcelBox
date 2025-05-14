import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MainConfigService } from './infrastructure/config/mainConfig.service'
import { applyAppSettings } from './infrastructure/applyAppSettings'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix('api')
	await applyAppSettings(app)

	const mainConfig = app.get(MainConfigService)
	await app.listen(mainConfig.get().port)
	console.log('ParcelBox server has just started 🔥')
}

bootstrap()
