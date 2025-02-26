'use client'

import React, { useEffect } from 'react'

export function UserProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		setUserToStore()
	}, [])

	return children
}

async function setUserToStore() {
	// 1. Сначала нужно проверить наличие данных о пользователе в Хранилище.
	// Если данные есть, то ничего не делать. А если оказались на странице входа или регистрации, то принудительно перебросить на главную.
	// 2. Если в Хранилище данных нет, то сначала сделать запрос на /me, который должен вернуть данные пользователя.
	// Если он вернул 401, то сделать запрос на /refresh-token, получить новый токен обновления и снова перейти ко второму пункту.
	// 3. Если /refresh-token вернул 401, то перебросить на страницу входа.
	console.log('Fetching user...')
}
