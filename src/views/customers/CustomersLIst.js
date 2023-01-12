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
      <CCardBody className="px-5">
        <CForm onSubmit={onSubmit}>
          <CRow className="my-3">
            <CCol lg="2">Name</CCol>
            <CCol lg="4">
              <CFormInput
                size="md"
                type="text"
                name="customer_name"
                values={searchValues.name}
                onChange={(e) => onChange(e)}
              />
            </CCol>
            <CCol lg="2">Phone Number</CCol>
            <CCol lg="4">
              <CFormInput
                size="md"
                type="text"
                name="phone_number"
                values={searchValues.phone_number}
                onChange={(e) => onChange(e)}
              />
            </CCol>
          </CRow>
          <CRow className="my-3">
            <CCol lg="2">Car Brand</CCol>
            <CCol lg="4">
              <CFormInput
                size="md"
                type="text"
                name="car_brand"
                values={searchValues.car_brand}
                onChange={(e) => onChange(e)}
              />
            </CCol>
            <CCol lg="2">Car Type</CCol>
            <CCol lg="4">
              <CFormInput
                size="md"
                type="text"
                name="car_type"
                values={searchValues.car_type}
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
