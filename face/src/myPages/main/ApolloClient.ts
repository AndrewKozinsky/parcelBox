import { HttpLink } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support'

// have a function to create a client for you
export default function getApolloClient() {
	const httpLink = new HttpLink({
		// Use Docker service name for server-side and relative URL for client-side
		uri: typeof window === 'undefined' 
			? 'http://parcelsserver:3001/api/graphql' // Server-side URL using Docker service name
			: '/api/graphql', // Client-side URL
		// you can disable result caching here if you want to
		// (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
		fetchOptions: { cache: 'no-store' },
		// you can override the default `fetchOptions` on a per query basis
		// via the `context` property on the options passed as a second argument
		// to an Apollo Client data fetching hook, e.g.:
		// const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
		credentials: 'include',
	})

	// use the `ApolloClient` from "@apollo/experimental-nextjs-app-support"
	return new ApolloClient({
		// use the `InMemoryCache` from "@apollo/experimental-nextjs-app-support"
		cache: new InMemoryCache(),
		link: httpLink,
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'no-cache',
			},
			query: {
				fetchPolicy: 'no-cache',
			},
			mutate: {
				fetchPolicy: 'no-cache',
			},
		},
	})
}
