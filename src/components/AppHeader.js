import React, { useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  CHeaderDivider,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import { AuthContext } from 'src/context/auth'
import { AppBreadcrumb } from './index'

const AppHeader = () => {
  const { user } = useContext(AuthContext)
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const loggedInName = (user) => {
    if (user) {
      if (user.username) {
        return user.username.charAt(0).toUpperCase() + user.username.slice(1)
      } else {
        return ''
      }
    }
  }
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/" />
        <CHeaderNav className="d-none d-md-flex me-auto" />
        <CHeaderNav>
          <CNavItem>
            <div>
              <span>Hi, {loggedInName(user)}</span>
            </div>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
