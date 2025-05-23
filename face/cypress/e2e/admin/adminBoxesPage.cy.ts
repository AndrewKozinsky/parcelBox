import { login } from '../utils/commands'
import { server } from '../utils/server'
import { usersConfig } from '../utils/users'

describe.skip('Admin boxes page', () => {
	beforeEach(() => {
		server.clearDB()
		server.seedInitData()
		server.seedTestData()
		cy.wait(100)
	})

	it.only('should show error if email and password fields filled with wrong data', () => {
		login(usersConfig.admin_4_conf)
	})
})
