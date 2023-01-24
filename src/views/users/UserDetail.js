import React, { useState, useEffect, useContext } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { useQuery, gql } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'
import { AuthContext } from 'src/context/auth'
import ChangePasswordModal from './ChangePasswordModal'
import { ToastContainer, toast } from 'react-toastify'

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID) {
    getUserById(_id: $id) {
      _id
      username
      role
      createdAt
    }
  }
`

const UserDetail = () => {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const [modalChangePassword, setModalChangePassword] = useState(false)
  const [toastTrigger, setToastTrigger] = useState(false)

  const { data, loading } = useQuery(GET_USER_BY_ID, {
    variables: {
      id: state._id,
    },
  })

  useEffect(() => {
    if (state === null) navigate('/')
    // eslint-disable-next-line
  }, [])

  const capitalizeString = (string) => {
    const changeUnderscore = string.replace(/_/g, ' ')
    return changeUnderscore.charAt(0).toUpperCase() + changeUnderscore.slice(1)
  }
  const changePasswordModalHandler = () => {
    setModalChangePassword(!modalChangePassword)
  }
  if (toastTrigger) {
    toast.success('Password berhasih di ganti')
    setToastTrigger(false)
  }
  return (
    <CRow>
      <CCol lg="6">
        {modalChangePassword && (
          <ChangePasswordModal
            modalChangePassword={modalChangePassword}
            setModalChangePassword={setModalChangePassword}
            _id={state._id}
            setToastTrigger={setToastTrigger}
          />
        )}
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol lg="6" />
              <CCol lg="6">
                <CButton
                  color="info"
                  className="float-end text-white"
                  onClick={changePasswordModalHandler}
                  size="sm"
                  disabled={user.role !== 'superadmin'}
                >
                  Ganti Password
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            {!loading && (
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <td>Username</td>
                    <td>{capitalizeString(data.getUserById.username)}</td>
                  </tr>

                  <tr>
                    <td>Role</td>
                    <td>{capitalizeString(data.getUserById.role)}</td>
                  </tr>
                  <tr>
                    <td>Created At</td>
                    <td>
                      {data.getUserById.createdAt &&
                        moment(data.getUserById.createdAt).format('MMMM Do YYYY, h:mm:ss A')}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <ToastContainer />
    </CRow>
  )
}

export default UserDetail
