import React from 'react'
import { Button } from 'antd'
import './CreateParcelBoxButton.scss'
import CreateParcelBoxModal from '../CreateParcelBoxModal/CreateParcelBoxModal'

function CreateParcelBoxButton() {
	return (
		<div className='create-parcel-button-panel'>
			<Button>Создать посыльный ящик</Button>
			<CreateParcelBoxModal />
		</div>
	)
}

export default CreateParcelBoxButton
