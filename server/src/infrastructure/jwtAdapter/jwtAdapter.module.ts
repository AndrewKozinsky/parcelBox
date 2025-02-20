import { Global, Module } from '@nestjs/common'
import { JwtAdapterService } from './jwtAdapter.service'

@Global()
@Module({
	imports: [],
	providers: [JwtAdapterService],
	exports: [JwtAdapterService],
})
export class JwtAdapterModule {}
