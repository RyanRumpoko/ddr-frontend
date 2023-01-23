import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  // CCardFooter,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  // CPagination,
  // CPaginationItem,
} from '@coreui/react'
import { useQuery, useLazyQuery, gql } from '@apollo/client'

const GET_ALL_SETTING_SERVICE_PAGINATION = gql`
  query GetAllSettingServicePagination($input: GetSettingServicePagination) {
    getAllSettingServicePagination(input: $input) {
      _id
      service_name
      base_price
      is_active
    }
  }
`

const GET_TOTAL_SETTING_sERVICE = gql`
  query GetTotalSettingService {
    getTotalAllSettingService
  }
`

const SettingService = () => {
  const [settingServiceList, setSettingServiceList] = useState([])
  // const [currentPage, setActivePage] = useState(1)
  // const [totalPage, setTotalPage] = useState(0)

  const [getAllSetting, { loading }] = useLazyQuery(GET_ALL_SETTING_SERVICE_PAGINATION, {
    onCompleted: (data) => {
      setSettingServiceList(data.getAllSettingServicePagination)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  useQuery(GET_TOTAL_SETTING_sERVICE, {
    onCompleted: (data) => {
      // const count = Math.ceil(data.getTotalAllSettingService / 25)
      // setTotalPage(count)
    },
  })

  useEffect(() => {
    getAllSetting({
      variables: {
        input: {
          page: 1,
          perPage: 100,
        },
      },
    })
    // eslint-disable-next-line
  }, [])

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const localString = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
  }
  const addNewSettingService = () => {}
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
            {settingServiceList && (
              <div className="mt-2 float-end">Total data: {settingServiceList.length}</div>
            )}
          </CCol>
        </CRow>
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
                  <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
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
      {/* <CCardFooter className="d-flex justify-content-center align-item-center">
        {totalPage && (
          <CPagination
          >
            <CPaginationItem>Previous</CPaginationItem>
            {totalPage &&
              totalPage.map((_, idx) => (
                <CPaginationItem key={idx}>{idx + 1}</CPaginationItem>
              ))}
            <CPaginationItem>Next</CPaginationItem>
          </CPagination>
        )}
      </CCardFooter> */}
    </CCard>
  )
}

export default SettingService