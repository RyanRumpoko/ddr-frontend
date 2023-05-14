import React, { useState, useEffect } from 'react'
import {
  CButton,
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
} from '@coreui/react'
import { useLazyQuery, gql } from '@apollo/client'
import AddSettingServiceModal from './AddSettingServiceModal'
import { toast } from 'react-toastify'
import { assignPagination } from 'src/util/Pagination'
import PaginationComponent from '../components/PaginationComponent'
import ItemsPerPageComponent from '../components/ItemsPerPageComponent'

const GET_ALL_SETTING_SERVICE_PAGINATION = gql`
  query GetAllSettingServicePagination($input: GetSettingServicePagination) {
    getAllSettingServicePagination(input: $input) {
      totalSearchData
      searchData {
        _id
        service_name
        base_price
        is_active
      }
    }
  }
`

const SettingService = () => {
  const [settingServiceList, setSettingServiceList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage, setPerPage] = useState(25)
  const [settingServiceModal, setSettingServiceModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [totalData, setTotalData] = useState(0)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [totalPaginate, setTotalPaginate] = useState(0)

  const [getAllSetting, { loading }] = useLazyQuery(GET_ALL_SETTING_SERVICE_PAGINATION, {
    onCompleted: (data) => {
      if (!isChangingPage) {
        const pagination = assignPagination(
          data.getAllSettingServicePagination.totalSearchData,
          perPage,
        )
        setTotalData(data.getAllSettingServicePagination.totalSearchData)
        setTotalPage(pagination.countArray)
        setTotalPaginate(pagination.totalPaginate)
      }
      setSettingServiceList(data.getAllSettingServicePagination.searchData)
      setIsChangingPage(false)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    getAllSetting({
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
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const localString = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
  }
  const addNewSettingService = () => {
    setSettingServiceModal(!settingServiceModal)
  }

  if (refreshTrigger) {
    getAllSetting({
      variables: {
        input: {
          page: currentPage,
          perPage: perPage,
        },
      },
    })
    setRefreshTrigger(false)
    toast.success('Setting service berhasil di tambahkan')
  }
  return (
    <CCard className="mt-3">
      <CCardHeader>
        <h3>Setting Service List</h3>
      </CCardHeader>
      <CCardBody>
        <CRow className="justify-content-center">
          <CCol lg="6">
            <CButton onClick={addNewSettingService} color="primary" className="mb-4 col-12">
              Tambah Service
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol lg="12">
            {settingServiceList && <div className="mt-2 float-end">Total data: {totalData}</div>}
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
              <CTableHeaderCell scope="col">Nama Service</CTableHeaderCell>
              <CTableHeaderCell scope="col">Harga Dasar</CTableHeaderCell>
              <CTableHeaderCell scope="col">isActive</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {!loading &&
              settingServiceList &&
              settingServiceList.length !== 0 &&
              settingServiceList.map((item, idx) => (
                <CTableRow key={item._id}>
                  <CTableHeaderCell scope="row">
                    {currentPage === 1 ? idx + 1 : (currentPage - 1) * perPage + idx + 1}
                  </CTableHeaderCell>
                  <CTableDataCell>{capitalizeString(item.service_name)}</CTableDataCell>
                  <CTableDataCell>{localString(item.base_price)}</CTableDataCell>
                  <CTableDataCell>{item.is_active ? 'Yes' : 'No'}</CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>
        </CTable>
        {!loading && settingServiceList.length === 0 && (
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
      {settingServiceModal && (
        <AddSettingServiceModal
          settingServiceModal={settingServiceModal}
          setSettingServiceModal={setSettingServiceModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
    </CCard>
  )
}

export default SettingService
