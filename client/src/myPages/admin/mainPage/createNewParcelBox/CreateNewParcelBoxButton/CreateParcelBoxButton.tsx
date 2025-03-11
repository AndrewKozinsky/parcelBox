import { Button, Modal } from 'antd'
import React from 'react'
import { FormStatus } from '../../../../common/form'
import { useAddParcelBoxStore } from '../addParcelBoxStore'
import CreateParcelBoxForm from '../CreateParcelBoxForm/CreateParcelBoxForm'
import { useGetChangeModalVisibility } from './fn/modal'
import './CreateParcelBoxButton.scss'

function CreateParcelBoxButton() {
	const isModalOpen = useAddParcelBoxStore((s) => s.isModalOpen)
	const formStatus = useAddParcelBoxStore((s) => s.formStatus)

	const showModal = useGetChangeModalVisibility(true)
	const closeModal = useGetChangeModalVisibility(false)

	return (
		<div className='create-parcel-button-panel'>
			<Button onClick={showModal}>Создать посыльный ящик</Button>
			<Modal
				title='Создание посыльного ящика'
				open={isModalOpen}
				// onOk={formSubmit}
				confirmLoading={formStatus === FormStatus.submitPending}
				onCancel={closeModal}
			>
				<CreateParcelBoxForm />
			</Modal>
		</div>
	)
}

export default CreateParcelBoxButton
