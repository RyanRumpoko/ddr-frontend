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
import AddSettingBrandModal from './AddSettingBrandModal'
import { toast } from 'react-toastify'
import { assignPagination } from 'src/util/Pagination'
import PaginationComponent from '../components/PaginationComponent'
import ItemsPerPageComponent from '../components/ItemsPerPageComponent'

const GET_ALL_SETTING_BRAND_PAGINATION = gql`
  query GetAllSettingBrandPagination($input: GetSettingBrandPagination) {
    getAllSettingBrandPagination(input: $input) {
      totalSearchData
      searchData {
        _id
        brand_name
        is_active
      }
    }
  }
`

const SettingBrand = () => {
  const [settingBrandList, setSettingBrandList] = useState([])
  const [settingBrandModal, setSettingBrandModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage, setPerPage] = useState(25)
  const [totalData, setTotalData] = useState(0)
  const [isChangingPage, setIsChangingPage] = useState(false)
  const [totalPaginate, setTotalPaginate] = useState(0)

  const [getAllSetting, { loading }] = useLazyQuery(GET_ALL_SETTING_BRAND_PAGINATION, {
    onCompleted: (data) => {
      if (!isChangingPage) {
        const pagination = assignPagination(
          data.getAllSettingBrandPagination.totalSearchData,
          perPage,
        )
        setTotalData(data.getAllSettingBrandPagination.totalSearchData)
        setTotalPage(pagination.countArray)
        setTotalPaginate(pagination.totalPaginate)
      }
      setSettingBrandList(data.getAllSettingBrandPagination.searchData)
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
  }, [currentPage])

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const addNewSettingService = () => {
    setSettingBrandModal(!settingBrandModal)
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
    toast.success('Setting brand berhasil di tambahkan')
  }

  return (
    <CCard className="mt-3">
      <CCardHeader>
        <h3>Setting Brand List</h3>
      </CCardHeader>
      <CCardBody>
        <CRow className="justify-content-center">
          <CCol lg="6">
            <CButton onClick={addNewSettingService} color="primary" className="mb-4 col-12">
              Tambah Brand
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol lg="12">
            {settingBrandList && <div className="mt-2 float-end">Total data: {totalData}</div>}
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
                <CTableHeaderCell scope="col">Nama Brand</CTableHeaderCell>
                <CTableHeaderCell scope="col">isActive</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {!loading &&
                settingBrandList &&
                settingBrandList.length !== 0 &&
                settingBrandList.map((item, idx) => (
                  <CTableRow key={item._id}>
                    <CTableHeaderCell scope="row">
                      {currentPage === 1 ? idx + 1 : (currentPage - 1) * perPage + idx + 1}
                    </CTableHeaderCell>
                    <CTableDataCell>{capitalizeString(item.brand_name)}</CTableDataCell>
                    <CTableDataCell>{item.is_active ? 'Yes' : 'No'}</CTableDataCell>
                  </CTableRow>
                ))}
            </CTableBody>
          </CTable>
        </div>
        {!loading && settingBrandList.length === 0 && (
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
      {settingBrandModal && (
        <AddSettingBrandModal
          settingBrandModal={settingBrandModal}
          setSettingBrandModal={setSettingBrandModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
    </CCard>
  )
}

export default SettingBrand
