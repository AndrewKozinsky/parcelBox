import { Global, Module } from '@nestjs/common'
import { AddressAdapterService } from './address-adapter.service'

@Global()
@Module({
	providers: [AddressAdapterService],
	exports: [AddressAdapterService],
})
export class AddressAdapterModule {}
