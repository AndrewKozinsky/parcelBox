import React from 'react'
import { ApolloWrapper } from '../ApolloWrapper'
import { UserProvider } from '../userProvider/UserProvider'
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
