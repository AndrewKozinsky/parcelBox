import React from 'react'
import CreateParcelBox from '../createNewParcelBox/CreateNewParcelBox/CreateParcelBox'
import ParcelBoxesList from '../ParcelBoxesList/ParcelBoxesList'

function AdminMainPage() {
	return (
		<div>
			<ParcelBoxesList />
			<CreateParcelBox />
		</div>
	)
}

export default AdminMainPage
