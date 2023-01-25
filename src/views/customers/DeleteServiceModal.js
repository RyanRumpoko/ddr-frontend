import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react'
import { gql, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID) {
    deleteService(id: $id)
  }
`

const DeleteServiceModal = ({ _id, deleteModal, setDeleteModal, setRefreshTrigger }) => {
  const [deleteService] = useMutation(DELETE_SERVICE)
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await deleteService({
        variables: {
          id: _id,
        },
      })
      setRefreshTrigger(true)
      setDeleteModal(false)
    } catch (error) {
      toast.error(error.graphQLErrors[0].message)
    }
  }
  return (
    <CModal visible={deleteModal} onClose={() => setDeleteModal(false)} backdrop="static">
      <CModalHeader closeButton>Delete Service</CModalHeader>
      <CModalBody>Anda yakin ingin menghapus service ini ?</CModalBody>
      <CModalFooter>
        <CButton color="danger" className="text-white" onClick={(e) => onSubmit(e)}>
          Delete
        </CButton>
        <CButton color="secondary" className="text-white" onClick={() => setDeleteModal(false)}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DeleteServiceModal
