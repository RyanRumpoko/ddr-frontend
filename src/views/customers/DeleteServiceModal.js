import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react'
import { gql, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID, $is_disc: Boolean) {
    deleteService(id: $id, is_disc: $is_disc)
  }
`

const DeleteServiceModal = ({
  _id,
  deleteModal,
  setDeleteModal,
  setRefreshTrigger,
  isDisc,
  setIsDisc,
}) => {
  const [deleteService] = useMutation(DELETE_SERVICE)

  const onCloseHandler = () => {
    setIsDisc(false)
    setDeleteModal(false)
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      await deleteService({
        variables: {
          id: _id,
          is_disc: isDisc,
        },
      })
      setRefreshTrigger(true)
      setDeleteModal(false)
    } catch (error) {
      toast.error(error.graphQLErrors[0].message)
    }
  }
  return (
    <CModal visible={deleteModal} onClose={onCloseHandler} backdrop="static">
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
