import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilCursor, cilSpeedometer, cilUser, cilBell, cilFile } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavGroup,
    name: 'Customers',
    to: '/customers',
    icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Customers List',
        to: '/customers/list',
      },
      {
        component: CNavItem,
        name: 'Add Customer',
        to: '/customers/add',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'Setting',
  },
  {
    component: CNavGroup,
    name: 'Setting',
    to: '/setting',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Setting Service',
        to: '/setting/service',
      },
      {
        component: CNavItem,
        name: 'Setting Brand',
        to: '/setting/brand',
      },
    ],
  },
  {
    component: CNavTitle,
    name: 'User',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/reports',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
]

export default _nav
