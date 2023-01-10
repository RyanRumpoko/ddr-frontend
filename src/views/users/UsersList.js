import React, { useContext, useState } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTable } from '@coreui/react'
import { useQuery, gql } from '@apollo/client'

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      _id
      username
    }
  }
`

const UsersList = () => {
  const [userList, setUserList] = useState([])

  const { loading } = useQuery(GET_ALL_USERS, {
    onCompleted: (data) => {
      const tableTemplate = data.getAllUsers.map((item, idx) => {
        return {
          index: idx + 1,
          username: item.username,
          role: item.role ? item.role : '-',
          _cellProps: { action: actionHandler() },
        }
      })
      setUserList(tableTemplate)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  const columns = [
    { key: 'index', label: '#', _props: { scope: 'col' } },
    { key: 'username', label: 'Username', _props: { scope: 'col' } },
    { key: 'role', label: 'Role', _props: { scope: 'col' } },
    { key: 'action', label: 'Action', _props: { scope: 'col' } },
  ]
  const actionHandler = () => {
    return (
      <td className="py-2">
        <CButton
          color="primary"
          variant="outline"
          shape="square"
          size="md"
          className="mr-1"
          onClick={() => {}}
        >
          Detail
        </CButton>
      </td>
    )
  }
  const addNewUserModal = () => {
    console.log('Yahu')
  }
  return (
    <CCard>
      <CCardHeader>
        <h3>Users List</h3>
      </CCardHeader>
      <CCardBody>
        <CCol>
          <CRow className="justify-content-center">
            <CCol lg="6">
              <CButton onClick={addNewUserModal} color="primary" className="mb-4 col-12">
                Add New User
              </CButton>
            </CCol>
          </CRow>
          <CRow>
            <CCol lg="12">
              <div className="mt-2 float-end">Total data: 100</div>
            </CCol>
          </CRow>
          {!loading && <CTable columns={columns} items={userList} />}
        </CCol>
      </CCardBody>
    </CCard>
  )
}

export default UsersList
