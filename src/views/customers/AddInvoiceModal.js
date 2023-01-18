import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import { gql, useMutation } from '@apollo/client'

const ADD_INVOICE = gql`
  mutation AddInvoice($input: InvoiceInput) {
    addUser(input: $input)
  }
`

const AddInvoiceModal = ({ invoiceModal, setInvoiceModal, id }) => {
  const [values, setValues] = useState({
    invoice_number: '',
    service_bulk: [],
    customer_id: id,
  })
  const [arrayInput, setArrayInput] = useState([
    {
      service_name: '',
      quantity: 0,
      price: 0,
      total: 0,
      status: 'estimated',
    },
  ])

  const [addNewInvoice] = useMutation(ADD_INVOICE)

  const addFormFields = () => {
    setArrayInput([
      ...arrayInput,
      { service_name: '', quantity: 0, price: 0, total: 0, status: 'estimated' },
    ])
  }
  const removeFormFields = (i) => {
    let newValues = [...arrayInput]
    newValues.splice(i, 1)
    setArrayInput(newValues)
  }
  const onChange = (i, e) => {
    let newValues = [...arrayInput]
    newValues[i][e.target.name] = e.target.value
    newValues[i]['total'] = newValues[i]['quantity'] * newValues[i]['price']
    setArrayInput(newValues)
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    setValues({ ...values, service_bulk: arrayInput })

    console.log(values, 'Ini Values')
    console.log(arrayInput, 'Ini Array Input')
  }
  return (
    <CModal
      size="lg"
      visible={invoiceModal}
      onClose={() => setInvoiceModal(false)}
      backdrop="static"
    >
      <CModalHeader closeButton>
        <CModalTitle>Tambah Invoice Baru</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          {arrayInput.map((el, idx) => (
            <CRow className="mb-3 justify-content-center" key={idx}>
              <CCol sm="3" className="pb-2">
                <CFormInput
                  type="text"
                  placeholder="Nama Barang"
                  name="service_name"
                  values={el.service_name}
                  onChange={(e) => onChange(idx, e)}
                  required
                />
              </CCol>
              <CCol sm="2" className="pb-2">
                <CFormInput
                  type="text"
                  placeholder="Jumlah"
                  name="quantity"
                  values={el.quantity}
                  onChange={(e) => onChange(idx, e)}
                  required
                />
              </CCol>
              <CCol sm="3" className="pb-2">
                <CFormInput
                  type="text"
                  placeholder="Harga"
                  name="price"
                  values={el.price}
                  onChange={(e) => onChange(idx, e)}
                  required
                />
              </CCol>
              <CCol sm="3">
                <div className="py-2 text-bold">
                  {el.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </div>
              </CCol>
              <CCol sm="1">
                <button
                  className="py-2"
                  style={{ border: 'none', backgroundColor: ' transparent' }}
                  onClick={() => removeFormFields(idx)}
                  type="button"
                >
                  <i className="fas fa-minus-circle fa-lg"></i>
                </button>
              </CCol>
            </CRow>
          ))}
          <CRow className="justify-content-center">
            <CCol sm="6" className="mb-3 text-center">
              <button
                style={{ border: 'none', backgroundColor: ' transparent' }}
                onClick={() => addFormFields()}
              >
                <i className="fas fa-plus-circle fa-lg"></i>
              </button>
            </CCol>
          </CRow>
          <CRow className="justify-content-center">
            <CCol sm="6">
              <CButton color="success" type="submit" className="col-12 text-white">
                Buat Invoice
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      {/* <ToastContainer /> */}
    </CModal>
  )
}

export default AddInvoiceModal
