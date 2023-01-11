import React, { useContext } from 'react'
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
import { AuthContext } from 'src/context/auth'

const LOGOUT = gql`
  mutation Logout($input: LogoutInput) {
    logout(input: $input)
  }
`

const AppHeaderDropdown = () => {
  const { user, logout } = useContext(AuthContext)

  let navigate = useNavigate()

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
  const settingHandler = () => {}

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar color="secondary" size="md">
          {user.username.charAt(0).toUpperCase()}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem onClick={settingHandler}>
          <CIcon icon={cilSettings} className="me-2" />
          Setting
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={logoutHandler}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
