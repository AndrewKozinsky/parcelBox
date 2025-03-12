import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs'
import { AddressAdapterService } from '../../infrastructure/addressAdapter/address-adapter.service'

export class GetAddressSuggestionsCommand implements ICommand {
	constructor(public addressQuery: string) {}
}

@CommandHandler(GetAddressSuggestionsCommand)
export class GetAddressSuggestionsHandler implements ICommandHandler<GetAddressSuggestionsCommand> {
	constructor(private addressAdapter: AddressAdapterService) {}

	async execute(command: GetAddressSuggestionsCommand) {
		const { addressQuery } = command

		return await this.addressAdapter.makeSuggestions(addressQuery)
	}
}
