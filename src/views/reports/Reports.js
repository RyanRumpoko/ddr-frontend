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
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { gql, useLazyQuery } from '@apollo/client'

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
  const DEFAULT_INVOICE_STATE = {
    estimated_date_min: '',
    estimated_date_max: '',
    ongoing_date_min: '',
    ongoing_date_max: '',
  }
  const [searchValues, setSearchValues] = useState(DEFAULT_INVOICE_STATE)
  const [datalist, setDataList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(25)

  const [searchInvoiceForReport] = useLazyQuery(SEARCH_INVOICE_FOR_REPORT, {
    onCompleted: (data) => {
      setDataList(data.searchInvoiceForReports.searchData)
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
  const localString = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
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
  const resetSearch = (e) => {}
  const searchHandler = () => {
    return (
      <>
        <CRow className="my-3">
          <CCol sm="2">Tanggal Estimasi [Dari] - [Ke]</CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="estimated_date_min"
              values={searchValues.estimated_date_min}
              onChange={(e) => onChange(e)}
            />
          </CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="estimated_date_max"
              values={searchValues.estimated_date_max}
              onChange={(e) => onChange(e)}
            />
          </CCol>
          <CCol sm="2">Tanggal Selesai [Dari] - [Ke]</CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="ongoing_date_min"
              values={searchValues.ongoing_date_min}
              onChange={(e) => onChange(e)}
            />
          </CCol>
          <CCol sm="2">
            <CFormInput
              type="date"
              name="ongoing_date_max"
              values={searchValues.ongoing_date_max}
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
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
                <CTableHeaderCell scope="col">Jenis Kendaraan</CTableHeaderCell>
                <CTableHeaderCell scope="col">No Polisi</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Jasa</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Non Jasa</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Invoice</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {datalist &&
                datalist.length !== 0 &&
                datalist.map((item, idx) => (
                  <CTableRow key={`${item._id}${idx}`}>
                    <CTableHeaderCell scope="row">
                      {currentPage === 1 ? idx + 1 : (currentPage - 1) * perPage + idx + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>{capitalizeString(item.name)}</CTableDataCell>
                    <CTableDataCell>
                      {capitalizeString(item.brand)} {capitalizeString(item.type)}
                    </CTableDataCell>
                    <CTableDataCell>{item.plate_number.toUpperCase()}</CTableDataCell>
                    <CTableDataCell>{localString(item.total_service)}</CTableDataCell>
                    <CTableDataCell>{localString(item.total_non_service)}</CTableDataCell>
                    <CTableDataCell>{localString(item.total_invoice)}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        variant="outline"
                        shape="square"
                        size="sm"
                        className="mr-1"
                        onClick={() => {
                          // invoiceListHandler(item)
                        }}
                      >
                        Detail
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
          <div className="text-center text-danger">Belum ada data</div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Reports
