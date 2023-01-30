import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CRow,
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
import AddSettingBrandModal from './AddSettingBrandModal'
import { toast, ToastContainer } from 'react-toastify'

const GET_ALL_SETTING_BRAND_PAGINATION = gql`
  query GetAllSettingBrandPagination($input: GetSettingBrandPagination) {
    getAllSettingBrandPagination(input: $input) {
      _id
      brand_name
      is_active
    }
  }
`

const GET_TOTAL_SETTING_BRAND = gql`
  query GetTotalSettingBrand {
    getTotalAllSettingBrand
  }
`

const SettingBrand = () => {
  const [settingBrandList, setSettingBrandList] = useState([])
  const [settingBrandModal, setSettingBrandModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [currentPage, setActivePage] = useState(1)
  const [totalPage, setTotalPage] = useState()
  const [perPage] = useState(25)
  const [totalData, setTotalData] = useState(0)

  const [getAllSetting, { loading }] = useLazyQuery(GET_ALL_SETTING_BRAND_PAGINATION, {
    onCompleted: (data) => {
      setSettingBrandList(data.getAllSettingBrandPagination)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  useQuery(GET_TOTAL_SETTING_BRAND, {
    onCompleted: (data) => {
      const count = Math.ceil(data.getTotalAllSettingBrand / perPage)
      const countArray = []
      for (let i = 1; i <= count; i++) {
        if (i <= 3) {
          countArray.push({ i, hidden: false })
        } else {
          countArray.push({ i, hidden: true })
        }
      }
      setTotalData(data.getTotalAllSettingBrand)
      setTotalPage(countArray)
    },
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
        {!loading && settingBrandList.length === 0 && (
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
      {settingBrandModal && (
        <AddSettingBrandModal
          settingBrandModal={settingBrandModal}
          setSettingBrandModal={setSettingBrandModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      <ToastContainer />
    </CCard>
  )
}

export default SettingBrand
