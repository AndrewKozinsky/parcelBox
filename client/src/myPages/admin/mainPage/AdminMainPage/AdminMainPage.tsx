import React from 'react'
import CreateParcelBoxButton from '../CreateNewParcelBoxButton/CreateParcelBoxButton'
import ParcelBoxesList from '../ParcelBoxesList/ParcelBoxesList'

function AdminMainPage() {
	return (
		<div>
			<ParcelBoxesList />
			<CreateParcelBoxButton />
		</div>
	)
}

export default AdminMainPage
