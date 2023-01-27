import React, { useState } from 'react'
import {
  CForm,
  CFormLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CButton,
  CFormSelect,
} from '@coreui/react'
import { gql, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

const UPDATE_STATUS = gql`
  mutation UpdateStatus($input: UpdateStatusInput) {
    updateStatus(input: $input) {
      status
    }
  }
`

const InvoiceStatusModal = ({
  item,
  updateStatusModal,
  setUpdateStatusModal,
  setRefreshTrigger,
  setIsUpdateStatus,
}) => {
  const [values, setValues] = useState({
    _id: item._id,
    status: item.status,
  })

  const [updateStatus] = useMutation(UPDATE_STATUS)

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    if (!values.status) {
      toast.error('Status tidak boleh kosong')
    }

    try {
      await updateStatus({
        variables: {
          input: values,
        },
      })
      setValues({
        _id: '',
        status: '',
      })
      setRefreshTrigger(true)
      setIsUpdateStatus(true)
      setUpdateStatusModal(false)
    } catch (error) {
      toast.error(error.graphQLErrors[0].message)
    }
  }
  return (
    <CModal
      visible={updateStatusModal}
      onClose={() => setUpdateStatusModal(false)}
      backdrop="static"
    >
      <CModalHeader closeButton>
        <CModalTitle>Update Status Invoice</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <CFormLabel>Status</CFormLabel>
            <CFormSelect
              name="status"
              value={values.status}
              onChange={onChange}
              options={[
                { label: 'Estimasi', value: 'estimated' },
                { label: 'Dikerjakan', value: 'ongoing' },
                { label: 'Selesai', value: 'done' },
                { label: 'Dibatalkan', value: 'canceled' },
              ]}
            />
          </div>
          <CRow className="justify-content-center">
            <CCol md="6">
              <CButton color="success" type="submit" className="col-12 text-white">
                Simpan
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default InvoiceStatusModal
