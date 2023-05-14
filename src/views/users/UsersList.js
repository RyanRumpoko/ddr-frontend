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
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import AddUserModal from './AddUserModal'

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      username
      role
    }
  }
`

const getRole = (role) => {
  switch (role) {
    case 'superadmin':
      return 'SuperAdmin'
    case 'admin':
      return 'Admin'
    default:
      return ''
  }
}

const UsersList = () => {
  const navigate = useNavigate()
  const [userList, setUserList] = useState([])
  const [userModal, setUserModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  const { loading, refetch } = useQuery(GET_ALL_USERS, {
    onCompleted: (data) => {
      setUserList(data.getAllUsers)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  const addNewUserModal = () => {
    setUserModal(!userModal)
  }
  const detailHandler = (data) => {
    navigate('/users/detail', { state: data })
  }
  if (refreshTrigger) {
    refetch()
    setRefreshTrigger(false)
    toast.success('User berhasil di buat')
  }
  return (
    <CCard>
      <CCardHeader>
        <h3>List Users</h3>
      </CCardHeader>
      <CCardBody>
        <CCol>
          <CRow className="justify-content-center">
            <CCol lg="6">
              <CButton onClick={addNewUserModal} color="primary" className="mb-4 col-12">
                Tambah User Baru
              </CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol lg="12">
              {userList && <div className="mt-2 float-end">Total data: {userList.length}</div>}
            </CCol>
          </CRow>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Nama User</CTableHeaderCell>
                <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                <CTableHeaderCell scope="col"></CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {!loading &&
                userList &&
                userList.length !== 0 &&
                userList.map((item, idx) => (
                  <CTableRow key={item._id}>
                    <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                    <CTableDataCell>{item.username}</CTableDataCell>
                    <CTableDataCell>{item.role ? getRole(item.role) : '-'}</CTableDataCell>
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
          {!loading && userList.length === 0 && <div className="text-center">No Data</div>}
        </CCol>
      </CCardBody>
      {userModal && (
        <AddUserModal
          userModal={userModal}
          setUserModal={setUserModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
    </CCard>
  )
}

export default UsersList
