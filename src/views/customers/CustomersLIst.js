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
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { useQuery, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const GET_ALL_CUSTOMERS = gql`
  query GetAllCustomers {
    getAllCustomers {
      _id
      name
      phone_number
      brand
      type
      plate_number
    }
  }
`

const CustomersList = () => {
  const [searchValues, setSearchValues] = useState({})
  const [customerList, setCustomerList] = useState([])

  let navigate = useNavigate()

  const { loading } = useQuery(GET_ALL_CUSTOMERS, {
    onCompleted: (data) => {
      setCustomerList(data.getAllCustomers)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const invoiceListHandler = (data) => {
    navigate('/customers/list/invoice', { state: data })
  }
  const onChange = (e) => {
    setSearchValues()
  }
  const onSubmit = (e) => {}

  const searchHandler = (e) => {
    return (
      <>
        <CCard>
          <CCardHeader>
            <h3>List Customer</h3>
          </CCardHeader>
          <CCardBody>
            <CForm onSubmit={onSubmit}>
              <CRow className="my-3">
                <CCol lg="2">Nama</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="name"
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
              <CRow className="my-3">
                <CCol lg="2">Nomor Polisi</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="plate_number"
                    value={searchValues.plate_number}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol lg="2">Merk</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="brand"
                    values={searchValues.brand}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol lg="2">Tipe</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="type"
                    values={searchValues.type}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol lg="2">Tahun</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="year"
                    values={searchValues.year}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol lg="2">Warna</CCol>
                <CCol lg="4">
                  <CFormInput
                    type="text"
                    name="color"
                    value={searchValues.color}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol lg="2">Transmisi</CCol>
                <CCol lg="4">
                  <CFormSelect
                    name="transmission"
                    value={searchValues.transmission}
                    onChange={(e) => onChange(e)}
                    options={[
                      '- Pilih Transmisi -',
                      { label: 'Manual', value: 'manual' },
                      { label: 'Automatic', value: 'automatic' },
                    ]}
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
                      <i className="fas fa-times "></i> Ulangi
                    </CButton>
                    <CButton type="submit" color="info" className="text-white">
                      <i className="fas fa-search "></i> Cari
                    </CButton>
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </>
    )
  }
  return (
    <>
      {searchHandler()}
      <CCard className="mt-3">
        <CCardBody>
          <CRow>
            <CCol lg="12">
              {customerList && (
                <div className="mt-2 float-end">Total data: {customerList.length}</div>
              )}
            </CCol>
          </CRow>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
                <CTableHeaderCell scope="col">No Telepon</CTableHeaderCell>
                <CTableHeaderCell scope="col">Jenis Kendaraan</CTableHeaderCell>
                <CTableHeaderCell scope="col">No Polisi</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {!loading &&
                customerList &&
                customerList.length !== 0 &&
                customerList.map((item, idx) => (
                  <CTableRow key={item._id}>
                    <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                    <CTableDataCell>{capitalizeString(item.name)}</CTableDataCell>
                    <CTableDataCell>{`0${item.phone_number}`}</CTableDataCell>
                    <CTableDataCell>
                      {capitalizeString(item.brand)} {capitalizeString(item.type)}
                    </CTableDataCell>
                    <CTableDataCell>{item.plate_number.toUpperCase()}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mr-1"
                        onClick={() => {
                          invoiceListHandler(item)
                        }}
                      >
                        Detail
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default CustomersList
