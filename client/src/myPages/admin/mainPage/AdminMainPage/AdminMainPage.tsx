import React from 'react'
import CreateParcelBox from '../createParcelBox/CreateParcelBox/CreateParcelBox'
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
