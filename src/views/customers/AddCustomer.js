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
  CNav,
  CNavItem,
  CNavLink,
  CTabPane,
  CTabContent,
  CFormSelect,
} from '@coreui/react'

const AddCustomer = () => {
  const [searchValues, setSearchValues] = useState({})
  const [activeKey, setActiveKey] = useState(1)

  const onChange = (e) => {
    setSearchValues()
  }
  const onSubmit = (e) => {}
  return (
    <CCard>
      <CCardHeader>
        <h3 className="text-center">Tambah Customer</h3>
      </CCardHeader>
      <CCardBody>
        <CNav variant="tabs" role="tablist">
          <CNavItem>
            <CNavLink
              href=""
              active={activeKey === 1}
              onClick={(e) => {
                e.preventDefault()
                setActiveKey(1)
              }}
            >
              Data Utama
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href=""
              active={activeKey === 2}
              onClick={(e) => {
                e.preventDefault()
                setActiveKey(2)
              }}
            >
              Data Kerusakan
            </CNavLink>
          </CNavItem>
        </CNav>
        <CTabContent>
          <CForm onSubmit={onSubmit}>
            <CTabPane visible={activeKey === 1}>
              <CRow>
                <CCol lg="4" className="border-bottom mt-3">
                  <h5>Data Customer</h5>
                </CCol>
              </CRow>
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
              <CRow>
                <CCol lg="4" className="border-bottom mt-3">
                  <h5>Data Kendaraan</h5>
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol lg="2">Merk</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="car_brand"
                    values={searchValues.car_brand}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol lg="2">Tipe</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="car_type"
                    values={searchValues.car_type}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol lg="2">Tahun</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="date"
                    name="car_year"
                    values={searchValues.car_year}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol lg="2">Transmisi</CCol>
                <CCol lg="4">
                  <CFormSelect
                    name="car_transmission"
                    values={searchValues.car_transmission}
                    onChange={(e) => onChange(e)}
                    options={[
                      '- Pilih Transmisi -',
                      { label: 'Manual', value: 'manual' },
                      { label: 'Automatic', value: 'automatic' },
                    ]}
                  />
                </CCol>
              </CRow>
            </CTabPane>
            <CRow className="justify-content-between">
              <CCol lg="12">
                <div className="mt-2 float-end">
                  <CButton
                    type="button"
                    color="warning"
                    className="me-2"
                    // onClick={(e) => resetSearch(e)}
                  >
                    <i className="fas fa-undo"></i> Reset
                  </CButton>
                  <CButton type="submit" color="info" className="text-white">
                    <i className="fas fa-save"></i> Simpan
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CTabContent>
      </CCardBody>
    </CCard>
  )
}

export default AddCustomer
