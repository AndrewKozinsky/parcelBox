import React from 'react'
import '@ant-design/v5-patch-for-react-19'
import { ApolloWrapper } from '../ApolloWrapper'
import { UserProvider } from '../UserProvider/UserProvider'
import {getCurrentUser} from './fn/getCurrentUser'
import './MainLayout.scss'

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {

	const user = await getCurrentUser()

	return (
		<ApolloWrapper>
			<UserProvider user={user} />
			<div className='main-layout'>{children}</div>
		</ApolloWrapper>
	)
}
