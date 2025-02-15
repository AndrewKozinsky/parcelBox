import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MainConfigModule } from './config/mainConfig.module'
import { MainConfigService } from './config/mainConfig.service'

@Module({
	imports: [MainConfigModule],
	controllers: [AppController],
	providers: [AppService, MainConfigService],
})
export class AppModule {}
