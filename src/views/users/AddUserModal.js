import React from 'react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'

const AddUserModal = ({ userModal, setUserModal }) => {
  return (
    <CModal visible={userModal} onClose={() => setUserModal(false)}>
      <CModalHeader closeButton>
        <CModalTitle>Add New Admin</CModalTitle>
      </CModalHeader>
      <CModalBody>Test</CModalBody>
    </CModal>
  )
}

export default AddUserModal
