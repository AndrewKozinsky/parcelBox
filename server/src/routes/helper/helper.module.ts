import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { GetAddressSuggestionsHandler } from '../../features/helper/GetAddressSuggestions.command'
import { HelperResolver } from './helper.resolver'

const commandHandlers = [GetAddressSuggestionsHandler]
const resolvers = [HelperResolver]

@Module({
	imports: [CqrsModule],
	controllers: [],
	providers: [...commandHandlers, ...resolvers],
})
export class HelperModule {}
