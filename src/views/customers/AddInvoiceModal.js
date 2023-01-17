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
  const [countQty, setCountQty] = useState()

  const addFormFields = () => {
    setArrayInput([
      ...arrayInput,
      { service_name: '', quantity: 0, price: 0, total: 0, status: 'estimated' },
    ])
  }
  const calculateTotal = (i, e) => {
    if (e.target.name === 'quantity') {
      setCountQty(e.target.value)
    } else {
      let newValues = [...arrayInput]
      newValues[i]['total'] = e.target.value * countQty
      setArrayInput(newValues)
    }
  }
  const onChange = (i, e) => {
    let newValues = [...arrayInput]
    newValues[i][e.target.name] = e.target.value
    // newValues[i]['total'] = newValues[i]['quantity'] * newValues[i]['price']
    setArrayInput(newValues)
  }
  const onSubmit = (e) => {
    e.preventDefault()
    console.log(arrayInput)
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
              <CCol md="4">
                <CFormInput
                  type="text"
                  placeholder="Nama Barang"
                  name="service_name"
                  values={el.service_name}
                  onChange={(e) => onChange(idx, e)}
                />
              </CCol>
              <CCol md="2">
                <CFormInput
                  id="1"
                  type="text"
                  placeholder="Jumlah"
                  name="quantity"
                  values={el.quantity}
                  onChange={(e) => onChange(idx, e)}
                  onBlur={(e) => calculateTotal(idx, e)}
                />
              </CCol>
              <CCol md="3">
                <CFormInput
                  id="1"
                  type="text"
                  placeholder="Harga"
                  name="price"
                  values={el.price}
                  onChange={(e) => onChange(idx, e)}
                  onBlur={(e) => calculateTotal(idx, e)}
                />
              </CCol>
              <CCol md="3">
                <CFormInput
                  id="3"
                  type="text"
                  placeholder="Total"
                  name="total"
                  values={el.total}
                  onChange={(e) => onChange(idx, e)}
                  disabled
                />
              </CCol>
            </CRow>
          ))}
          <CRow className="justify-content-center">
            <CCol md="6">
              <CButton
                color="primary"
                className="col-12 text-white"
                onClick={() => addFormFields()}
              >
                Tambah Barang
              </CButton>
            </CCol>
            <CCol md="6">
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
