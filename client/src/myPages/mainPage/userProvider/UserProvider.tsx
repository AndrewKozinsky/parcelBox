'use client'

import React, { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'

export function UserProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		setUserToStore()
	}, [])

	return children
}

async function setUserToStore() {
	// If a user is already exists does nothing
	const { user } = useUserStore.getState()
	if (user) return

	// 2. Если в Хранилище данных нет, то сначала сделать запрос на /me, который должен вернуть данные пользователя.
	// Если он вернул 401, то сделать запрос на /refresh-token, получить новый токен обновления и снова перейти ко второму пункту.
	// 3. Если /refresh-token вернул 401, то перебросить на страницу входа.
	console.log('Fetching user...')
}
