import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
} from '@coreui/react'

const CustomersList = () => {
  const [searchValues, setSearchValues] = useState({})
  const onChange = (e) => {
    setSearchValues()
  }
  const onSubmit = (e) => {}
  return (
    <CCard>
      <CCardHeader>
        <h3>Customer List</h3>
      </CCardHeader>
      <CCardBody>
        <CForm onSubmit={onSubmit}>
          <CRow className="my-3">
            <CCol lg="2">Nama</CCol>
            <CCol lg="4">
              <CFormInput
                type="text"
                name="customer_name"
                values={searchValues.name}
                onChange={(e) => onChange(e)}
              />
            </CCol>
            <CCol lg="2">Nomor Telepon</CCol>
            <CCol lg="4">
              <CFormInput
                type="text"
                name="phone_number"
                values={searchValues.phone_number}
                onChange={(e) => onChange(e)}
              />
            </CCol>
          </CRow>
          <CRow className="mt-5 mb-3">
            <CCol lg="2">Merk</CCol>
            <CCol lg="4">
              <CFormInput
                type="text"
                name="brand"
                values={searchValues.brand}
                onChange={(e) => onChange(e)}
              />
            </CCol>
            <CCol lg="2">Tipe</CCol>
            <CCol lg="4">
              <CFormInput
                type="text"
                name="type"
                values={searchValues.type}
                onChange={(e) => onChange(e)}
              />
            </CCol>
          </CRow>
          <CRow className="my-3">
            <CCol lg="2">Tahun</CCol>
            <CCol lg="4">
              <CFormInput
                type="text"
                name="year"
                values={searchValues.year}
                onChange={(e) => onChange(e)}
              />
            </CCol>
            <CCol lg="2">Transmisi</CCol>
            <CCol lg="4">
              <CFormInput
                type="text"
                name="transmission"
                values={searchValues.transmission}
                onChange={(e) => onChange(e)}
              />
            </CCol>
          </CRow>
          <CRow className="justify-content-between">
            <CCol lg="12">
              <div className="mt-2 float-end">
                <CButton
                  type="button"
                  color="warning"
                  className="me-2"
                  // onClick={(e) => resetSearch(e)}
                >
                  <i className="fas fa-times "></i> Reset
                </CButton>
                <CButton type="submit" color="info" className="text-white">
                  <i className="fas fa-search "></i> Search
                </CButton>
              </div>
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default CustomersList
