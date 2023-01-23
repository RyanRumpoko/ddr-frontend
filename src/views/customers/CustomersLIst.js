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
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

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

const SEARCH_CUSTOMER = gql`
  query SearchCustomer($input: SearchCustomerInput) {
    searchCustomer(input: $input) {
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
  const DEFAULT_STATE = {
    name: '',
    phone_number: '',
    brand: '',
    type: '',
    plate_number: '',
    color: '',
    transmission: '',
    year: '',
  }
  const [searchValues, setSearchValues] = useState(DEFAULT_STATE)
  const [customerList, setCustomerList] = useState([])

  let navigate = useNavigate()

  const { loading, refetch } = useQuery(GET_ALL_CUSTOMERS, {
    onCompleted: (data) => {
      setCustomerList(data.getAllCustomers)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  const [searchCustomer] = useLazyQuery(SEARCH_CUSTOMER, {
    onCompleted: (data) => {
      setCustomerList(data.searchCustomer)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  const capitalizeString = (string) => {
    const changeUnderscore = string.replace(/_/g, ' ')
    return changeUnderscore.charAt(0).toUpperCase() + changeUnderscore.slice(1)
  }
  const invoiceListHandler = (data) => {
    navigate('/customers/list/invoices', { state: data })
  }
  const onChange = (e) => {
    setSearchValues({
      ...searchValues,
      [e.target.name]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    let inputCheck = 0

    for (const el in searchValues) {
      if (searchValues[el]) {
        inputCheck++
      }
    }
    if (inputCheck === 0) {
      toast.warning('Must have at least 1 filter criteria.')
      return
    }
    await searchCustomer({
      variables: { input: searchValues },
    })
  }
  const resetSearch = (e) => {
    e.preventDefault()
    Array.from(document.querySelectorAll('input')).forEach((input) => (input.value = ''))
    setSearchValues(DEFAULT_STATE)
    refetch()
  }

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
                <CCol sm="2">Nama</CCol>
                <CCol sm="4">
                  <CFormInput
                    type="text"
                    name="name"
                    values={searchValues.name}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol sm="2">Nomor Telepon</CCol>
                <CCol sm="4">
                  <CFormInput
                    type="text"
                    name="phone_number"
                    values={searchValues.phone_number}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol sm="2">Nomor Polisi</CCol>
                <CCol sm="4">
                  <CFormInput
                    type="text"
                    name="plate_number"
                    value={searchValues.plate_number}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol sm="2">Merk</CCol>
                <CCol sm="4">
                  <CFormInput
                    type="text"
                    name="brand"
                    values={searchValues.brand}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol sm="2">Tipe</CCol>
                <CCol sm="4">
                  <CFormInput
                    type="text"
                    name="type"
                    values={searchValues.type}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol sm="2">Tahun</CCol>
                <CCol sm="4">
                  <CFormInput
                    type="text"
                    name="year"
                    values={searchValues.year}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
              </CRow>
              <CRow className="my-3">
                <CCol sm="2">Warna</CCol>
                <CCol sm="4">
                  <CFormInput
                    type="text"
                    name="color"
                    value={searchValues.color}
                    onChange={(e) => onChange(e)}
                  />
                </CCol>
                <CCol sm="2">Transmisi</CCol>
                <CCol sm="4">
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
                <CCol sm="12">
                  <div className="mt-2 float-end">
                    <CButton
                      type="button"
                      color="warning"
                      className="me-2"
                      onClick={(e) => resetSearch(e)}
                    >
                      <i className="fas fa-times"></i> Ulangi
                    </CButton>
                    <CButton type="submit" color="info" className="text-white">
                      <i className="fas fa-search"></i> Cari
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
          {!loading && customerList.length === 0 && (
            <div className="text-center text-danger">Belum ada data</div>
          )}
        </CCardBody>
        <ToastContainer />
      </CCard>
    </>
  )
}

export default CustomersList
