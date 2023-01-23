import React, { useState, useEffect } from 'react'
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
import { useLazyQuery, gql } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router-dom'
import AddInvoiceModal from './AddInvoiceModal'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const GET_INVOICES_BY_CUSTOMER_ID = gql`
  query GetInvoiceByCustomerId($id: ID) {
    getInvoiceByCustomerId(id: $id) {
      _id
      invoice_number
      status
    }
  }
`

const getStatus = (status) => {
  switch (status) {
    case 'estimated':
      return 'Estimasi'
    case 'ongoing':
      return 'Dikerjakan'
    case 'done':
      return 'Selesai'
    case 'canceled':
      return 'Dibatalkan'
    default:
      return ''
  }
}

const Invoices = () => {
  const { state } = useLocation()
  const [invoiceList, setInvoiceList] = useState([])
  const [invoiceModal, setInvoiceModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)

  let navigate = useNavigate()

  const [getInvoices, { loading, refetch }] = useLazyQuery(GET_INVOICES_BY_CUSTOMER_ID, {
    onCompleted: (data) => {
      setInvoiceList(data.getInvoiceByCustomerId)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (state === null) navigate('/404')
    else {
      getInvoices({
        variables: {
          id: state._id,
        },
      })
    }
    // eslint-disable-next-line
  }, [])

  const addNewInvoiceModal = () => {
    setInvoiceModal(!invoiceModal)
  }
  const invoiceDetailHandler = (data) => {
    navigate('/customers/list/invoices/detail', { state: data })
  }
  if (refreshTrigger) {
    refetch()
    setRefreshTrigger(false)
    toast.success('Invoice berhasi dibuat')
  }

  return (
    <CCard className="mt-3">
      <CCardHeader>
        <h3>List Invoice </h3>
      </CCardHeader>
      <CCardBody>
        <CRow className="justify-content-center">
          <CCol lg="6">
            <CButton onClick={addNewInvoiceModal} color="primary" className="mb-4 col-12">
              Tambah Invoice
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol lg="12">
            {invoiceList && <div className="mt-2 float-end">Total data: {invoiceList.length}</div>}
          </CCol>
        </CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">No Invoice</CTableHeaderCell>
              <CTableHeaderCell scope="col">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {!loading &&
              invoiceList &&
              invoiceList.length !== 0 &&
              invoiceList.map((item, idx) => (
                <CTableRow key={item._id}>
                  <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                  <CTableDataCell>{item.invoice_number}</CTableDataCell>
                  <CTableDataCell>{getStatus(item.status)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="warning"
                      variant="outline"
                      shape="square"
                      size="sm"
                      // onClick={() => {
                      //   invoiceListHandler(item)
                      // }}
                    >
                      Edit
                    </CButton>
                    <CButton
                      color="primary"
                      variant="outline"
                      shape="square"
                      size="sm"
                      className="mx-1"
                      onClick={() => {
                        invoiceDetailHandler(item)
                      }}
                    >
                      Detail
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>
        </CTable>
        {!loading && invoiceList.length === 0 && (
          <div className="text-center text-danger">Belum ada data</div>
        )}
      </CCardBody>
      {invoiceModal && (
        <AddInvoiceModal
          invoiceModal={invoiceModal}
          setInvoiceModal={setInvoiceModal}
          id={state._id}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      <ToastContainer />
    </CCard>
  )
}

export default Invoices
