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

const SEARCH_INVOICE = gql`
  query SearchInvoice($input: SearchInvoiceInput) {
    searchInvoice(input: $input) {
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
  const DEFAULT_INVOICE_STATE = {
    estimated_date_min: '',
    estimated_date_max: '',
    ongoing_date_min: '',
    ongoing_date_max: '',
    invoice_number: '',
    total_invoice: 0,
  }
  const [searchValues, setSearchValues] = useState(DEFAULT_STATE)
  const [searchInvoiceValues, setSearchInvoiceValues] = useState(DEFAULT_INVOICE_STATE)
  const [customerList, setCustomerList] = useState([])
  const [settingBrandList, setSettingBrandList] = useState([])
  const [currentPage, setActivePage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage] = useState(25)
  const [isSearching, setIsSearching] = useState(false)
  const [isInvoiceSearching, setIsInvoiceSearching] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [isLaquo, setIsLaquo] = useState(false)

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
      if (!isLaquo) {
        setTotalData(data.searchCustomer.totalSearchData)
        setTotalPage(countArray)
      }
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
  const [searchInvoice] = useLazyQuery(SEARCH_INVOICE, {
    onCompleted: (data) => {
      const count = Math.ceil(data.searchInvoice.totalSearchData / perPage)
      const countArray = []
      for (let i = 1; i <= count; i++) {
        if (i <= 3) {
          countArray.push({ i, hidden: false })
        } else {
          countArray.push({ i, hidden: true })
        }
      }
      if (!isLaquo) {
        setTotalData(data.searchInvoice.totalSearchData)
        setTotalPage(countArray)
      }
      setCustomerList(data.searchInvoice.searchData)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    const monthStart = date.toISOString().slice(0, 7)
    if (isInvoiceSearching && isSearching) {
      searchInvoice({
        variables: {
          input: {
            ...searchInvoiceValues,
            page: currentPage,
            perPage: perPage,
            total_invoice: Number(searchInvoiceValues.total_invoice),
          },
        },
      })
    } else if (isSearching) {
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
      if (!isLaquo) {
        getTotalCustomerByMonth({
          variables: {
            input: {
              this_month: monthStart,
            },
          },
        })
      }
    }
    setIsLaquo(false)
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
    setIsLaquo(true)
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
  const onChangeInvoice = (e) => {
    setSearchInvoiceValues({
      ...searchInvoiceValues,
      [e.target.name]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    setActivePage(1)
    setIsSearching(true)

    if (isInvoiceSearching) {
      let inputCheck = 0
      for (const el in searchInvoiceValues) {
        if (searchInvoiceValues[el]) {
          inputCheck++
        }
      }
      if (inputCheck === 0) {
        toast.warning('Must have at least 1 filter criteria.')
        return
      }
      if (searchInvoiceValues.estimated_date_min && !searchInvoiceValues.estimated_date_max) {
        return toast.error('Tanggal estimasi harus terisi semua')
      } else if (
        !searchInvoiceValues.estimated_date_min &&
        searchInvoiceValues.estimated_date_max
      ) {
        return toast.error('Tanggal estimasi harus terisi semua')
      }
      if (searchInvoiceValues.ongoing_date_min && !searchInvoiceValues.ongoing_date_max) {
        return toast.error('Tanggal estimasi harus terisi semua')
      } else if (!searchInvoiceValues.ongoing_date_min && searchInvoiceValues.ongoing_date_max) {
        return toast.error('Tanggal estimasi harus terisi semua')
      }
      if (
        new Date(searchInvoiceValues.estimated_date_min).getTime() >
          new Date(searchInvoiceValues.estimated_date_max).getTime() ||
        new Date(searchInvoiceValues.ongoing_date_min).getTime() >
          new Date(searchInvoiceValues.ongoing_date_max).getTime()
      ) {
        return toast.error('Tanggal invalid')
      }
      if (searchInvoiceValues.total_invoice < 0) {
        return toast.error('Nominal tidak boleh lebih kecil daripada 0')
      } else if (searchInvoiceValues.total_invoice % 1 !== 0) {
        return toast.error('Nominal tidak boleh desimal')
      }

      await searchInvoice({
        variables: {
          input: {
            ...searchInvoiceValues,
            page: currentPage,
            perPage: perPage,
            total_invoice: Number(searchInvoiceValues.total_invoice),
          },
        },
      })
    } else {
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
  }
  const resetSearch = async (e) => {
    e.preventDefault()
    const monthStart = date.toISOString().slice(0, 7)
    setActivePage(1)
    setIsSearching(false)

    Array.from(document.querySelectorAll('input')).forEach((input) => (input.value = ''))
    setSearchValues(DEFAULT_STATE)
    setSearchInvoiceValues(DEFAULT_INVOICE_STATE)

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

  const searchHandler = () => {
    return (
      <>
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
      </>
    )
  }
  const searchInvoiceHandler = () => {
    return (
      <>
        <CRow className="my-3">
          <CCol sm="2">Tanggal Estimasi [Dari] - [Ke]</CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="estimated_date_min"
              values={searchInvoiceValues.estimated_date_min}
              onChange={(e) => onChangeInvoice(e)}
            />
          </CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="estimated_date_max"
              values={searchInvoiceValues.estimated_date_max}
              onChange={(e) => onChangeInvoice(e)}
            />
          </CCol>
          <CCol sm="2">Tanggal Selesai [Dari] - [Ke]</CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="ongoing_date_min"
              values={searchInvoiceValues.ongoing_date_min}
              onChange={(e) => onChangeInvoice(e)}
            />
          </CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="ongoing_date_max"
              values={searchInvoiceValues.ongoing_date_max}
              onChange={(e) => onChangeInvoice(e)}
            />
          </CCol>
        </CRow>
        <CRow className="my-3">
          <CCol sm="2">No Invoice</CCol>
          <CCol sm="4">
            <CFormInput
              type="text"
              name="invoice_number"
              value={searchInvoiceValues.invoice_number}
              onChange={(e) => onChangeInvoice(e)}
            />
          </CCol>
          <CCol sm="2">Nominal</CCol>
          <CCol sm="4">
            <CFormInput
              type="number"
              name="total_invoice"
              value={searchInvoiceValues.total_invoice}
              onChange={(e) => onChangeInvoice(e)}
              min="0"
            />
          </CCol>
        </CRow>
      </>
    )
  }
  return (
    <>
      <CCard>
        <CCardHeader>
          <h3>List Customer</h3>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="6" className="h4">
              {isInvoiceSearching ? 'Pencarian dengan Invoice' : 'Pencarian Umum'}
            </CCol>
            <CCol md="6">
              <CButton
                color="primary text-white float-end"
                onClick={() => setIsInvoiceSearching(!isInvoiceSearching)}
              >
                Ganti Pencarian
              </CButton>
            </CCol>
          </CRow>
          <hr className="mb-4" />
          <CForm onSubmit={onSubmit}>
            {isInvoiceSearching && searchInvoiceHandler()}
            {!isInvoiceSearching && searchHandler()}
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
      <CCard className="mt-3">
        <CCardBody>
          <CRow>
            <CCol md="12">
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
