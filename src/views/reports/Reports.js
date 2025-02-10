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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { gql, useLazyQuery } from '@apollo/client'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import AddReportModal from './AddReportModal'
import { assignPagination } from 'src/util/Pagination'
import PaginationComponent from '../components/PaginationComponent'
import ItemsPerPageComponent from '../components/ItemsPerPageComponent'
import moment from 'moment'

const GET_ALL_REPORTS_PAGINATION = gql`
  query GetAllReportPagination($input: ReportPaginationInput) {
    getAllReportPagination(input: $input) {
      totalSearchData
      searchData {
        _id
        name
        total_service
        total_non_service
        total_report
        start_date
        finish_date
      }
    }
  }
`

const SEARCH_INVOICE_FOR_REPORT = gql`
  query SearchInvoiceForReports($input: SearchInvoiceForReportInput) {
    searchInvoiceForReports(input: $input) {
      totalSearchData
      searchData {
        _id
        name
        brand
        type
        plate_number
        total_invoice
        total_service
        total_non_service
      }
    }
  }
`

const Reports = () => {
  const navigate = useNavigate()
  const DEFAULT_REPORT_STATE = {
    name: '',
    start_date: '',
    finish_date: '',
  }
  const [searchValues, setSearchValues] = useState(DEFAULT_REPORT_STATE)
  const [datalist, setDataList] = useState([])
  const [reportModal, setReportModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage, setPerPage] = useState(25)
  const [totalData, setTotalData] = useState(0)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [totalPaginate, setTotalPaginate] = useState(0)

  const [getAllReport, { loading }] = useLazyQuery(GET_ALL_REPORTS_PAGINATION, {
    onCompleted: (data) => {
      if (!isChangingPage) {
        const pagination = assignPagination(data.getAllReportPagination.totalSearchData, perPage)
        setTotalData(data.getAllReportPagination.totalSearchData)
        setTotalPage(pagination.countArray)
        setTotalPaginate(pagination.totalPaginate)
      }
      setDataList(data.getAllReportPagination.searchData)
      setIsChangingPage(false)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  const [searchInvoiceForReport] = useLazyQuery(SEARCH_INVOICE_FOR_REPORT, {
    onCompleted: (data) => {
      setDataList(data.searchInvoiceForReports.searchData)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    getAllReport({
      variables: {
        input: {
          page: currentPage,
          perPage: perPage,
        },
      },
    })
    // eslint-disable-next-line
  }, [currentPage, perPage])

  const capitalizeString = (string) => {
    const changeUnderscore = string.replace(/_/g, ' ')
    return changeUnderscore.charAt(0).toUpperCase() + changeUnderscore.slice(1)
  }
  const localString = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
  }
  const addNewReport = () => {
    setReportModal(!reportModal)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await searchInvoiceForReport({
      variables: { input: { ...searchValues, page: 1, perPage: 1 } },
    })
  }
  const onChange = (e) => {
    setSearchValues({
      ...searchValues,
      [e.target.name]: e.target.value,
    })
  }
  const resetSearch = (e) => {
    e.preventDefault()
    Array.from(document.querySelectorAll('input')).forEach((input) => (input.value = ''))
    setSearchValues(DEFAULT_REPORT_STATE)
  }
  const detailHandler = (data) => {
    navigate('/reports/detail', { state: data })
  }
  if (refreshTrigger) {
    getAllReport({
      variables: {
        input: {
          page: currentPage,
          perPage: perPage,
        },
      },
    })
    setRefreshTrigger(false)
    toast.success('Report berhasil di tambahkan')
  }
  const searchHandler = () => {
    return (
      <>
        <CRow className="my-3">
          <CCol sm="2">Nama Report</CCol>
          <CCol sm="4">
            <CFormInput
              type="text"
              name="name"
              values={searchValues.name}
              onChange={(e) => onChange(e)}
            />
          </CCol>
          <CCol sm="2">Tanggal Selesai [Dari] - [Ke]</CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="start_date"
              values={searchValues.start_date}
              onChange={(e) => onChange(e)}
            />
          </CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="finish_date"
              values={searchValues.finish_date}
              onChange={(e) => onChange(e)}
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
          <h3>List Report</h3>
        </CCardHeader>
        <CCardBody>
          <CRow className="justify-content-center">
            <CCol lg="6">
              <CButton
                onClick={addNewReport}
                color="primary"
                className="mb-4 mt-2 col-12 text-white"
              >
                Tambah Report
              </CButton>
            </CCol>
          </CRow>
          <CForm onSubmit={onSubmit}>
            {searchHandler()}
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
              {datalist && <div className="mt-2 float-end">Total data: {totalData}</div>}
            </CCol>
          </CRow>
          <ItemsPerPageComponent
            perPage={perPage}
            setPerPage={setPerPage}
            setCurrentPage={setCurrentPage}
          />
          <div className="table-responsive">
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Nama Report</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Periode</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total Jasa</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total Non Jasa</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                  <CTableHeaderCell scope="col"></CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {!loading &&
                  datalist &&
                  datalist.length !== 0 &&
                  datalist.map((item, idx) => (
                    <CTableRow key={`${item._id}${idx}`}>
                      <CTableHeaderCell scope="row">
                        {currentPage === 1 ? idx + 1 : (currentPage - 1) * perPage + idx + 1}
                      </CTableHeaderCell>
                      <CTableDataCell>{capitalizeString(item.name)}</CTableDataCell>
                      <CTableDataCell>
                        {`${moment(item.start_date).format('D MMM YYYY')} -
                        ${moment(item.finish_date).format('D MMM YYYY')}`}
                      </CTableDataCell>
                      <CTableDataCell>{localString(item.total_service)}</CTableDataCell>
                      <CTableDataCell>{localString(item.total_non_service)}</CTableDataCell>
                      <CTableDataCell>{localString(item.total_report)}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="primary"
                          variant="outline"
                          shape="square"
                          size="sm"
                          className="mr-1"
                          onClick={() => {
                            detailHandler(item)
                          }}
                        >
                          Detail
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
              </CTableBody>
            </CTable>
          </div>
          {!loading && datalist.length === 0 && (
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
        {reportModal && (
          <AddReportModal
            reportModal={reportModal}
            setReportModal={setReportModal}
            setRefreshTrigger={setRefreshTrigger}
          />
        )}
      </CCard>
    </>
  )
}

export default Reports
