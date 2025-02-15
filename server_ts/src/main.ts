import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MainConfigService } from './config/mainConfig.service'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	const mainConfig = app.get(MainConfigService)
	await app.listen(mainConfig.get().port)
}

bootstrap()
