import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
} from '@coreui/react'
import { gql, useLazyQuery } from '@apollo/client'
import { useLocation } from 'react-router-dom'
import { assignPagination } from 'src/util/Pagination'
import ItemsPerPageComponent from '../components/ItemsPerPageComponent'
import PaginationComponent from '../components/PaginationComponent'
import FileSaver from 'file-saver'
import XLSX from 'sheetjs-style'
import moment from 'moment'

const GET_REPORT_DETAIL = gql`
  query GetReportDetail($input: ReportDetailInput) {
    getReportDetail(input: $input) {
      totalSearchData
      searchData {
        _id
        customer_id {
          name
          plate_number
          brand
          type
        }
        ongoing_date
        total_invoice
        total_service
        total_non_service
      }
    }
  }
`
const GET_REPORT_DOWNLOAD = gql`
  query GetReportDownload($input: ReportDownloadInput) {
    getReportDownload(input: $input) {
      _id
      customer_id {
        name
        plate_number
        brand
        type
      }
      ongoing_date
      total_invoice
      total_service
      total_non_service
    }
  }
`

const ReportDetail = () => {
  const { state } = useLocation()
  const [datalist, setDataList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage, setPerPage] = useState(25)
  const [totalData, setTotalData] = useState(0)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [totalPaginate, setTotalPaginate] = useState(0)

  const [getReportDetail, { loading }] = useLazyQuery(GET_REPORT_DETAIL, {
    onCompleted: (data) => {
      if (!isChangingPage) {
        const pagination = assignPagination(data.getReportDetail.totalSearchData, perPage)
        setTotalData(data.getReportDetail.totalSearchData)
        setTotalPage(pagination.countArray)
        setTotalPaginate(pagination.totalPaginate)
      }
      setDataList(data.getReportDetail.searchData)
      setIsChangingPage(false)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  const [getReportDownload] = useLazyQuery(GET_REPORT_DOWNLOAD, {
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    getReportDetail({
      variables: {
        input: {
          start_date: state.start_date,
          finish_date: state.finish_date,
          page: currentPage,
          perPage: perPage,
        },
      },
    })
    // eslint-disable-next-line
  }, [currentPage, perPage])

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const localString = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
  }

  const downloadHandler = async (e) => {
    e.preventDefault()

    await getReportDownload({
      variables: {
        input: {
          start_date: state.start_date,
          finish_date: state.finish_date,
        },
      },
    }).then(({ data: downloadData }) => {
      const fileName = `laporan-${state.name.toLowerCase()}`
      const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      const fileExtension = '.xlsx'

      const excelData = [
        [],
        ['TANGGAL', 'JENIS MOBIL', 'NOPOL', 'NAMA', 'TOTAL', 'JASA & REKON', 'SPARE PARTS'],
      ]
      downloadData.getReportDownload.forEach((el) => {
        excelData.push([
          moment(el.ongoing_date).format('D MMM YYYY'),
          el.customer_id.type.toUpperCase(),
          el.customer_id.plate_number.toUpperCase(),
          el.customer_id.name.toUpperCase(),
          el.total_invoice,
          el.total_service,
          el.total_non_service,
        ])
      })
      excelData.push(
        [],
        ['', '', '', 'TOTAL', state.total_report, state.total_service, state.total_non_service],
      )

      const ws = XLSX.utils.aoa_to_sheet(excelData)
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
      ws['!cols'] = [{ wch: 15 }, { wch: 35 }, { wch: 15 }, { wch: 15 }]
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
      const data = new Blob([excelBuffer], { type: fileType })
      FileSaver.saveAs(data, fileName + fileExtension)
    })
  }
  return (
    <CCard className="mt-3">
      <CCardHeader>
        <CRow className="d-flex align-items-center justify-content-center">
          <CCol sm="8">
            <h3>Report Detail</h3>
          </CCol>
          <CCol sm="4">
            <CButton
              size="sm"
              color="info text-white"
              className="float-end"
              onClick={downloadHandler}
              disabled={loading}
            >
              Download Invoice
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol lg="12">
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
                <CTableHeaderCell scope="col">Tanggal</CTableHeaderCell>
                <CTableHeaderCell scope="col">Jenis Kendaraan</CTableHeaderCell>
                <CTableHeaderCell scope="col">No Polisi</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nama</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Jasa</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Non Jasa</CTableHeaderCell>
                <CTableHeaderCell scope="col">Total Invoice</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {!loading &&
                datalist &&
                datalist.length !== 0 &&
                datalist.map((item, idx) => (
                  <CTableRow key={item._id}>
                    <CTableHeaderCell scope="row">
                      {currentPage === 1 ? idx + 1 : (currentPage - 1) * perPage + idx + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>
                      {item.ongoing_date ? moment(item.ongoing_date).format('D MMM YYYY') : '-'}
                    </CTableDataCell>
                    <CTableDataCell>
                      {capitalizeString(item.customer_id.brand)}{' '}
                      {capitalizeString(item.customer_id.type)}
                    </CTableDataCell>
                    <CTableDataCell>{item.customer_id.plate_number.toUpperCase()}</CTableDataCell>
                    <CTableDataCell>{capitalizeString(item.customer_id.name)}</CTableDataCell>
                    <CTableDataCell>{localString(item.total_service)}</CTableDataCell>
                    <CTableDataCell>{localString(item.total_non_service)}</CTableDataCell>
                    <CTableDataCell>{localString(item.total_invoice)}</CTableDataCell>
                  </CTableRow>
                ))}
              <CTableRow>
                <CTableDataCell />
                <CTableDataCell />
                <CTableDataCell />
                <CTableDataCell />
                <CTableDataCell className="fw-bold">TOTAL</CTableDataCell>
                <CTableDataCell className="fw-bold">
                  {localString(state.total_service)}
                </CTableDataCell>
                <CTableDataCell className="fw-bold">
                  {localString(state.total_non_service)}
                </CTableDataCell>
                <CTableDataCell className="fw-bold">
                  {localString(state.total_report)}
                </CTableDataCell>
              </CTableRow>
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
    </CCard>
  )
}

export default ReportDetail
