import React, { useContext, useState } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilSettings, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useMutation, gql } from '@apollo/client'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from 'src/context/auth'
import ChangePasswordModal from 'src/views/users/ChangePasswordModal'

const LOGOUT = gql`
  mutation Logout($input: LogoutInput) {
    logout(input: $input)
  }
`

const AppHeaderDropdown = () => {
  const { user, logout } = useContext(AuthContext)
  let navigate = useNavigate()

  const [modalChangePassword, setModalChangePassword] = useState(false)
  const [toastTrigger, setToastTrigger] = useState(false)

  const [signout] = useMutation(LOGOUT)

  const logoutHandler = async () => {
    try {
      await signout({ variables: { input: { _id: user._id } } })
      logout()
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }
  const changePasswordHandler = () => {
    setModalChangePassword(!modalChangePassword)
  }
  if (toastTrigger) {
    toast.success('Password berhasih di ganti')
    setToastTrigger(false)
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar color="secondary" size="md">
          {user.username.charAt(0).toUpperCase()}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem onClick={changePasswordHandler}>
          <CIcon icon={cilSettings} className="me-2" />
          Ganti Password
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={logoutHandler}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
        {modalChangePassword && (
          <ChangePasswordModal
            modalChangePassword={modalChangePassword}
            setModalChangePassword={setModalChangePassword}
            _id={user._id}
            setToastTrigger={setToastTrigger}
          />
        )}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
