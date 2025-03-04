import React from 'react'
import '@ant-design/v5-patch-for-react-19'
import { ApolloWrapper } from '../ApolloWrapper'
import { UserProvider } from '../UserProvider/UserProvider'
import './MainLayout.scss'

export default function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ApolloWrapper>
			<UserProvider>
				<div className='main-layout'>{children}</div>
			</UserProvider>
		</ApolloWrapper>
	)
}
