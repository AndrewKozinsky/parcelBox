'use client'

import {AdminOutModel, SenderOutModel, User_Role} from '../../../graphql'
import {useUserStore} from '../../../stores/userStore'

type UserOrNull = SenderOutModel | AdminOutModel | null

type UserProviderProps = {
	user: UserOrNull
}

export function UserProvider(props: UserProviderProps) {
	const { user } = props

	if (user) {
		if (user.role === User_Role.Sender) {
			useUserStore.getState().setSenderUser(user as SenderOutModel)
		} else if (user.role === User_Role.Admin) {
			useUserStore.getState().setAdminUser(user as AdminOutModel)
		}
	} else {
		useUserStore.getState().clearUser()
	}

	return null
}
