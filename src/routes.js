import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
// Users
const Users = React.lazy(() => import('./views/users/UsersList'))
const UserDetail = React.lazy(() => import('./views/users/UserDetail'))
// Customer
const Customers = React.lazy(() => import('./views/customers/CustomersLIst'))
const AddCustomer = React.lazy(() => import('./views/customers/AddCustomer'))
const EditCustomer = React.lazy(() => import('./views/customers/EditCustomer'))
const Invoices = React.lazy(() => import('./views/customers/Invoices'))
const InvoiceDetail = React.lazy(() => import('./views/customers/InvoiceDetail'))
// Setting
const SettingService = React.lazy(() => import('./views/setting/SettingService'))
const SettingBrand = React.lazy(() => import('./views/setting/SettingBrand'))
// Reports
const Reports = React.lazy(() => import('./views/reports/Reports'))
const ReportDetail = React.lazy(() => import('./views/reports/ReportDetail'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users },
  { path: '/users/detail', name: 'User Detail', element: UserDetail },
  { path: '/customers/list', name: 'Customers', element: Customers },
  { path: '/customers/add', name: 'Add Customers', element: AddCustomer },
  { path: '/customers/list/edit', name: 'Edit Customers', element: EditCustomer },
  { path: '/customers/list/invoices', name: 'Invoices', element: Invoices },
  { path: '/customers/list/invoices/detail', name: 'Invoices Detail', element: InvoiceDetail },
  { path: '/setting/service', name: 'Setting Service', element: SettingService },
  { path: '/setting/brand', name: 'Setting Brand', element: SettingBrand },
  { path: '/reports', name: 'Reports', element: Reports },
  { path: '/reports/detail', name: 'Report Detail', element: ReportDetail },
]

export default routes
