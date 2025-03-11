import { LoginFormTest } from '../../../src/myPages/auth/login/LoginForm/fn/form'
import { routeNames } from '../../../src/utils/routeNames'
import { checkIsPage, login } from '../utils/commands'
import { server } from '../utils/server'
import { usersConfig } from '../utils/users'

describe('Admin boxes page', () => {
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
