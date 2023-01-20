import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// Users
const Users = React.lazy(() => import('./views/users/UsersList'))
// Customer
const Customers = React.lazy(() => import('./views/customers/CustomersList'))
const AddCustomer = React.lazy(() => import('./views/customers/AddCustomer'))
const Invoices = React.lazy(() => import('./views/customers/Invoices'))
// Setting
const SettingService = React.lazy(() => import('./views/setting/SettingService'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  { path: '/customers/list', name: 'Customers', element: Customers },
  { path: '/customers/add', name: 'Add Customers', element: AddCustomer },
  { path: '/customers/list/invoice', name: 'Invoices', element: Invoices },
  { path: '/setting/service', name: 'Setting Service', element: SettingService },
]

export default routes
