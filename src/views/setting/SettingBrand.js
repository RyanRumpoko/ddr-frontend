import React, { useState } from 'react'
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
import { useQuery, gql } from '@apollo/client'
import AddSettingBrandModal from './AddSettingBrandModal'
import { toast, ToastContainer } from 'react-toastify'

const GET_ALL_SETTING_BRAND = gql`
  query GetAllSettingBrand {
    getAllSettingBrand {
      _id
      brand_name
      is_active
    }
  }
`

const SettingBrand = () => {
  const [settingBrandList, setSettingBrandList] = useState()
  const [settingBrandModal, setSettingBrandModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  const { loading, refetch } = useQuery(GET_ALL_SETTING_BRAND, {
    onCompleted: (data) => {
      setSettingBrandList(data.getAllSettingBrand)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const addNewSettingService = () => {
    setSettingBrandModal(!settingBrandModal)
  }

  if (refreshTrigger) {
    refetch()
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
            {settingBrandList && (
              <div className="mt-2 float-end">Total data: {settingBrandList.length}</div>
            )}
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
                  <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
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
