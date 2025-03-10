import { CommandBus, ICommand } from '@nestjs/cqrs'
import { SeedTestDataCommand } from '../../src/features/test/SeedTestData.command'

/**
 * Seed database with some data for testing.
 */
export async function seedTestData(commandBus: CommandBus<ICommand>) {
	const command = new SeedTestDataCommand()
	await commandBus.execute(command)
}
