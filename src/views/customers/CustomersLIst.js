import React, { useState, useEffect } from 'react'
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
import { createSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { assignPagination } from 'src/util/Pagination'
import PaginationComponent from '../components/PaginationComponent'
import ItemsPerPageComponent from '../components/ItemsPerPageComponent'
import { useQueryURL } from 'src/util/useQueryURL'

const GET_CUSTOMERS_PAGINATION_BY_MONTH = gql`
  query GetCustomersPaginationByMonth($input: GetCustomersPaginationByMonthInput) {
    getCustomersPaginationByMonth(input: $input) {
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage, setPerPage] = useState(25)
  const [isSearching, setIsSearching] = useState(false)
  const [isInvoiceSearching, setIsInvoiceSearching] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [totalPaginate, setTotalPaginate] = useState(0)

  let navigate = useNavigate()
  const urlQuery = useQueryURL()
  const date = new Date()

  const [getCustomerByMonth, { loading }] = useLazyQuery(GET_CUSTOMERS_PAGINATION_BY_MONTH, {
    onCompleted: (data) => {
      if (!isChangingPage) {
        const pagination = assignPagination(
          data.getCustomersPaginationByMonth.totalSearchData,
          perPage,
        )
        setTotalData(data.getCustomersPaginationByMonth.totalSearchData)
        setTotalPage(pagination.countArray)
        setTotalPaginate(pagination.totalPaginate)
      }
      setCustomerList(data.getCustomersPaginationByMonth.searchData)
      setIsChangingPage(false)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  const [searchCustomer] = useLazyQuery(SEARCH_CUSTOMER, {
    onCompleted: (data) => {
      if (!isChangingPage) {
        const pagination = assignPagination(data.searchCustomer.totalSearchData, perPage)
        setTotalData(data.searchCustomer.totalSearchData)
        setTotalPage(pagination.countArray)
        setTotalPaginate(pagination.totalPaginate)
      }
      setCustomerList(data.searchCustomer.searchData)
      setIsChangingPage(false)
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
      if (!isChangingPage) {
        const pagination = assignPagination(data.searchInvoice.totalSearchData, perPage)
        setTotalData(data.searchInvoice.totalSearchData)
        setTotalPage(pagination.countArray)
        setTotalPaginate(pagination.totalPaginate)
      }
      setCustomerList(data.searchInvoice.searchData)
      setIsChangingPage(false)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (urlQuery.get('invoice') === 'false') {
      const querySearch = {
        name: urlQuery.get('name'),
        phone_number: urlQuery.get('phone_number'),
        brand: urlQuery.get('brand'),
        type: urlQuery.get('type'),
        plate_number: urlQuery.get('plate_number'),
        color: urlQuery.get('color'),
        transmission: urlQuery.get('transmission'),
        year: urlQuery.get('year'),
      }
      setIsInvoiceSearching(false)
      setSearchValues({ ...querySearch })
      submitSearch(querySearch)
    } else if (urlQuery.get('invoice') === 'true') {
      const queryInvoice = {
        estimated_date_min: urlQuery.get('estimated_date_min'),
        estimated_date_max: urlQuery.get('estimated_date_max'),
        ongoing_date_min: urlQuery.get('ongoing_date_min'),
        ongoing_date_max: urlQuery.get('ongoing_date_max'),
        invoice_number: urlQuery.get('invoice_number'),
        total_invoice: urlQuery.get('total_invoice'),
      }
      setIsInvoiceSearching(true)
      setSearchInvoiceValues(queryInvoice)
      submitInvoice(queryInvoice)
    }
    // eslint-disable-next-line
  }, [])
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
    }
    // eslint-disable-next-line
  }, [perPage, currentPage])

  const capitalizeString = (string) => {
    const changeUnderscore = string.replace(/_/g, ' ')
    return changeUnderscore.charAt(0).toUpperCase() + changeUnderscore.slice(1)
  }
  const invoiceListHandler = (data) => {
    // const win = window.open(`/customers/list/invoices`, '_blank')
    // win.focus()
    navigate('/customers/list/invoices', { state: data })
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
  const submitInvoice = async (data) => {
    await searchInvoice({
      variables: {
        input: {
          ...data,
          page: currentPage,
          perPage: perPage,
          total_invoice: Number(searchInvoiceValues.total_invoice),
        },
      },
    })
  }
  const submitSearch = async (data) => {
    await searchCustomer({
      variables: { input: { ...data, page: currentPage, perPage: perPage } },
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    setCurrentPage(1)
    setIsSearching(true)

    if (isInvoiceSearching) {
      navigate({
        search: `?${createSearchParams({ ...searchInvoiceValues, invoice: true })}`,
      })
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
      navigate({
        search: `?${createSearchParams({ ...searchValues, invoice: false })}`,
      })
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
    setCurrentPage(1)
    setIsSearching(false)

    Array.from(document.querySelectorAll('input')).forEach((input) => (input.value = ''))
    setSearchValues(DEFAULT_STATE)
    setSearchInvoiceValues(DEFAULT_INVOICE_STATE)

    try {
      await getCustomerByMonth({
        variables: {
          input: {
            this_month: monthStart,
            page: 1,
            perPage: perPage,
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
          <ItemsPerPageComponent
            perPage={perPage}
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
          />
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
        {totalPage && (
          <PaginationComponent
            currentPage={currentPage}
            totalPage={totalPage}
            setCurrentPage={setCurrentPage}
            setTotalPage={setTotalPage}
            setIsChangingPage={setIsChangingPage}
            totalPaginate={totalPaginate}
          />
        )}
      </CCard>
    </>
  )
}

export default CustomersList
