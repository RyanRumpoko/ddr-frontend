import React, { useState } from 'react'
import {
  CForm,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CButton,
  CFormTextarea,
} from '@coreui/react'
import { gql, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

const ADD_INVOICE_NOTE = gql`
  mutation AddInvoiceNote($input: NoteInput) {
    addInvoiceNote(input: $input) {
      note
    }
  }
`

const AddNoteModal = ({ noteModal, setNoteModal, setNoteRefreshTrigger, id, note }) => {
  const [values, setValues] = useState({
    note: note ? note : '',
  })

  const [addNote] = useMutation(ADD_INVOICE_NOTE)

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      await addNote({
        variables: {
          input: {
            _id: id,
            note: values.note,
          },
        },
      })
      setNoteRefreshTrigger(true)
      setNoteModal(false)
    } catch (error) {
      toast.error(error.graphQLErrors[0].message)
    }
  }
  return (
    <CModal visible={noteModal} onClose={() => setNoteModal(false)} backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>Tambah Note</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <CFormTextarea
              name="note"
              label="Note"
              rows={3}
              text="Tidak lebih dari 200 huruf"
              onChange={onChange}
              value={values.note}
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

export default AddNoteModal
