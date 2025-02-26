import React from 'react'
import type { Metadata } from 'next'
import { ApolloWrapper } from './_mainPage/ApolloWrapper'
import { UserProvider } from './_mainPage/getUserDataAndSetToStore/UserProvider'
import './_mainPage/css/global.scss'

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body>
				<UserProvider>
					<ApolloWrapper>{children}</ApolloWrapper>
				</UserProvider>
			</body>
		</html>
	)
}
