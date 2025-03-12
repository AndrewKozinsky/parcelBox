import { UsePipes, ValidationPipe } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { GetAddressSuggestionsCommand } from '../../features/helper/GetAddressSuggestions.command'
import RouteNames from '../../infrastructure/routeNames'
import { GetAddressSuggestionsInput } from './inputs/getAddressSuggestions.input'
import { helperResolversDesc } from './resolverDescriptions'

@Resolver()
export class HelperResolver {
	constructor(private commandBus: CommandBus) {}

	@Query(() => Boolean, {
		name: RouteNames.HELPER.ADDRESS_SUGGESTIONS,
		description: helperResolversDesc.getAddressSuggestions,
	})
	@UsePipes(new ValidationPipe({ transform: true }))
	async getAddressSuggestions(@Args('input') input: GetAddressSuggestionsInput) {
		// const res = await this.commandBus.execute(new GetAddressSuggestionsCommand(input.address))
		// console.log(res)
		return true
	}
}
