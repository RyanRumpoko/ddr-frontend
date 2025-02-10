import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import { gql, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

const ADD_REPORT = gql`
  mutation AddReport($input: ReportInput) {
    addReport(input: $input) {
      _id
    }
  }
`

const AddReportModal = ({ reportModal, setReportModal, setRefreshTrigger }) => {
  const [values, setValues] = useState({
    name: '',
    start_date: '',
    finish_date: '',
  })

  const [addReport, { loading }] = useMutation(ADD_REPORT)

  const errors = []
  const notify = () => {
    for (let i = 0; i < errors.length; i++) {
      return errors[i]
    }
  }

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    if (!values.name) {
      errors.push(toast.error('Nama report tidak boleh kosong'))
    }
    if (!values.start_date) {
      errors.push(toast.error('Tanggal awal tidak boleh kosong'))
    }
    if (!values.finish_date) {
      errors.push(toast.error('Tanggal akhir tidak boleh kosong'))
    }

    if (errors.length > 0) {
      notify()
    } else {
      try {
        await addReport({
          variables: {
            input: { ...values },
          },
        })
        setValues({
          name: '',
          start_date: '',
          finish_Date: '',
        })
        setRefreshTrigger(true)
        setReportModal(false)
      } catch (error) {
        toast.error(error.graphQLErrors[0].message)
      }
    }
  }
  return (
    <CModal
      visible={reportModal}
      onClose={() => {
        if (!loading) setReportModal(false)
      }}
      backdrop="static"
    >
      <CModalHeader closeButton>
        <CModalTitle>Tambah Report Baru</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <CFormLabel>Nama Report</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Januari 2024"
              name="name"
              value={values.name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <CFormLabel>Tanggal Awal</CFormLabel>
            <CFormInput
              type="date"
              name="start_date"
              values={values.start_date}
              onChange={(e) => onChange(e)}
            />
          </div>
          <div className="form-group mb-3">
            <CFormLabel>Tanggal Akhir</CFormLabel>
            <CFormInput
              type="date"
              name="finish_date"
              values={values.finish_date}
              onChange={(e) => onChange(e)}
            />
          </div>
          <CRow className="justify-content-center">
            <CCol md="6">
              {!loading && (
                <CButton color="success" type="submit" className="col-12 text-white">
                  Tambah
                </CButton>
              )}
              {loading && (
                <div className="text-center">
                  <button className="btn btn-primary text-white" type="button" disabled>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Loading...</span>
                  </button>
                </div>
              )}
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default AddReportModal
