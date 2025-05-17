'use client'

import React from 'react'
import {useRouter} from 'next/navigation'
import {routeNames} from '../../../../utils/routeNames'

function AuthPage() {
	const router = useRouter()
	router.push(routeNames.auth.login.path)

	return <div>AuthPage</div>
}

export default AuthPage
