'use client'
// ^ this file needs the "use client" pragma


import { ApolloNextAppProvider, ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support'
import React from 'react'
import getApolloClient from './ApolloClient'

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
	return <ApolloNextAppProvider makeClient={getApolloClient}>{children}</ApolloNextAppProvider>
}
