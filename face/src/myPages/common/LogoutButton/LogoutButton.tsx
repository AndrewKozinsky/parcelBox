'use client'

import React from 'react'
import { Button } from 'antd'
import { useGetOnLogoutBtnClick } from './fn/logout'

function LogoutButton() {
	const onBtnClick = useGetOnLogoutBtnClick()

	return (
		<Button size='small' onClick={onBtnClick}>
			Выйти
		</Button>
	)
}

export default LogoutButton
