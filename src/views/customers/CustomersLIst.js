import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { useQuery, useLazyQuery, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'

const GET_CUSTOMERS_PAGINATION_BY_MONTH = gql`
  query GetCustomersPaginationByMonth($input: GetCustomersPaginationByMonthInput) {
    getCustomersPaginationByMonth(input: $input) {
      _id
      name
      phone_number
      brand
      type
      plate_number
      color
      transmission
      year
    }
  }
`

const GET_TOTAL_CUSTOMERS_BY_MONTH = gql`
  query getTotalCustomersPaginationByMonth($input: GetTotalCustomersPaginationByMonthInput) {
    getTotalCustomersPaginationByMonth(input: $input)
  }
`

const SEARCH_CUSTOMER = gql`
  query SearchCustomer($input: SearchCustomerInput) {
    searchCustomer(input: $input) {
      totalSearchData
      searchData {
        _id
        name
        phone_number
        brand
        type
        plate_number
        color
        transmission
        year
      }
    }
  }
`

const GET_ALL_SETTING_BRAND = gql`
  query GetAllSettingBrand {
    getAllSettingBrand {
      _id
      brand_name
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
  const [settingBrandList, setSettingBrandList] = useState([])
  const [currentPage, setActivePage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage] = useState(25)
  const [isSearching, setIsSearching] = useState(false)
  const [totalData, setTotalData] = useState(0)

  let navigate = useNavigate()
  const date = new Date()

  const [getCustomerByMonth, { loading }] = useLazyQuery(GET_CUSTOMERS_PAGINATION_BY_MONTH, {
    onCompleted: (data) => {
      setCustomerList(data.getCustomersPaginationByMonth)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  const [getTotalCustomerByMonth] = useLazyQuery(GET_TOTAL_CUSTOMERS_BY_MONTH, {
    onCompleted: (data) => {
      const count = Math.ceil(data.getTotalCustomersPaginationByMonth / perPage)
      const countArray = []
      for (let i = 1; i <= count; i++) {
        if (i <= 3) {
          countArray.push({ i, hidden: false })
        } else {
          countArray.push({ i, hidden: true })
        }
      }
      setTotalData(data.getTotalCustomersPaginationByMonth)
      setTotalPage(countArray)
    },
  })
  const [searchCustomer] = useLazyQuery(SEARCH_CUSTOMER, {
    onCompleted: (data) => {
      const count = Math.ceil(data.searchCustomer.totalSearchData / perPage)
      const countArray = []
      for (let i = 1; i <= count; i++) {
        if (i <= 3) {
          countArray.push({ i, hidden: false })
        } else {
          countArray.push({ i, hidden: true })
        }
      }
      setTotalData(data.searchCustomer.totalSearchData)
      setTotalPage(countArray)
      setCustomerList(data.searchCustomer.searchData)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  const { loading: loadingSetting } = useQuery(GET_ALL_SETTING_BRAND, {
    onCompleted: (data) => {
      setSettingBrandList(data.getAllSettingBrand)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    const monthStart = date.toISOString().slice(0, 7)
    if (isSearching) {
      searchCustomer({
        variables: { input: { ...searchValues, page: currentPage, perPage: perPage } },
      })
    } else {
      getCustomerByMonth({
        variables: {
          input: {
            this_month: monthStart,
            page: currentPage,
            perPage: perPage,
          },
        },
      })
      getTotalCustomerByMonth({
        variables: {
          input: {
            this_month: monthStart,
          },
        },
      })
    }
    // eslint-disable-next-line
  }, [currentPage])

  const capitalizeString = (string) => {
    const changeUnderscore = string.replace(/_/g, ' ')
    return changeUnderscore.charAt(0).toUpperCase() + changeUnderscore.slice(1)
  }
  const invoiceListHandler = (data) => {
    navigate('/customers/list/invoices', { state: data })
  }
  const laquoHandler = (direction) => {
    if (direction === 'left' && currentPage > 1) {
      setActivePage(currentPage - 1)
      const newPage = [...totalPage]
      if (currentPage + 2 <= totalPage.length) {
        newPage[currentPage + 1].hidden = true
        newPage[currentPage - 2].hidden = false
      }
      setTotalPage(newPage)
    } else if (direction === 'right' && currentPage < totalPage.length) {
      const newPage = [...totalPage]
      if (totalPage.length - currentPage > 0 && currentPage > 2) {
        newPage[currentPage - 3].hidden = true
        newPage[currentPage].hidden = false
      }
      setTotalPage(newPage)
      setActivePage(currentPage + 1)
    }
  }
  const onChange = (e) => {
    setSearchValues({
      ...searchValues,
      [e.target.name]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    setActivePage(1)
    setIsSearching(true)
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
      variables: { input: { ...searchValues, page: currentPage, perPage: perPage } },
    })
  }
  const resetSearch = async (e) => {
    e.preventDefault()
    const monthStart = date.toISOString().slice(0, 7)
    setActivePage(1)
    setIsSearching(false)

    Array.from(document.querySelectorAll('input')).forEach((input) => (input.value = ''))
    setSearchValues(DEFAULT_STATE)

    try {
      await getCustomerByMonth({
        variables: {
          input: {
            this_month: monthStart,
            page: currentPage,
            perPage: perPage,
          },
        },
      })
      await getTotalCustomerByMonth({
        variables: {
          input: {
            this_month: monthStart,
          },
        },
      })
    } catch (error) {
      console.log(error)
    }
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
                  {!loadingSetting && settingBrandList && (
                    <>
                      <CFormInput
                        list="dataService"
                        type="text"
                        name="brand"
                        value={searchValues.brand}
                        onChange={(e) => onChange(e)}
                      />
                      <datalist id="dataService">
                        {settingBrandList.map((item) => (
                          <option key={item._id} value={item._brand_name}>
                            {capitalizeString(item.brand_name)}
                          </option>
                        ))}
                      </datalist>
                    </>
                  )}
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
              {customerList && <div className="mt-2 float-end">Total data: {totalData}</div>}
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
                    <CTableHeaderCell scope="row">
                      {currentPage === 1 ? idx + 1 : (currentPage - 1) * perPage + idx + 1}
                    </CTableHeaderCell>
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
        <CCardFooter className="d-flex justify-content-center align-item-center">
          {totalPage && (
            <CPagination>
              <CPaginationItem onClick={() => laquoHandler('left')} disabled={currentPage === 1}>
                Previous
              </CPaginationItem>
              {totalPage.map((item, idx) => (
                <CPaginationItem
                  key={idx}
                  onClick={() => setActivePage(idx + 1)}
                  active={currentPage === idx + 1}
                  hidden={item.hidden}
                >
                  {idx + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                onClick={() => laquoHandler('right')}
                disabled={currentPage === totalPage.length}
              >
                Next
              </CPaginationItem>
            </CPagination>
          )}
        </CCardFooter>
        <ToastContainer />
      </CCard>
    </>
  )
}

export default CustomersList
