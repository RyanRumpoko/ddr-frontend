import React, { useState, useEffect, useContext } from 'react'
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
import InvoiceStatusModal from './InvoiceStatusModal'
import AddInvoiceBeforeModal from './AddInvoiceBeforeModal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from 'src/context/auth'
import moment from 'moment'

const GET_INVOICES_BY_CUSTOMER_ID = gql`
  query GetInvoiceByCustomerId($id: ID) {
    getInvoiceByCustomerId(id: $id) {
      _id
      invoice_number
      status
      total_invoice
      estimated_date
      ongoing_date
      note
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
  const { user } = useContext(AuthContext)

  const [invoiceList, setInvoiceList] = useState([])
  const [invoiceModal, setInvoiceModal] = useState(false)
  const [updateStatusModal, setUpdateStatusModal] = useState(false)
  const [invoiceBeforeModal, setInvoiceBeforeModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [itemUpdateStatus, setItemUpdateStatus] = useState({
    _id: '',
    status: '',
  })
  const [isUpdateStatus, setIsUpdateStatus] = useState(false)

  let navigate = useNavigate()

  const [getInvoices, { loading }] = useLazyQuery(GET_INVOICES_BY_CUSTOMER_ID, {
    onCompleted: (data) => {
      setInvoiceList(data.getInvoiceByCustomerId)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (state === null) navigate('/')
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
  const addInvoiceBeforeModal = () => {
    setInvoiceBeforeModal(!invoiceBeforeModal)
  }
  const invoiceDetailHandler = (data) => {
    navigate('/customers/list/invoices/detail', { state: data })
  }
  const changeStatusHandler = (item) => {
    setItemUpdateStatus({ _id: item._id, status: item.status })
    setUpdateStatusModal(!updateStatusModal)
  }
  const editHandler = () => {
    navigate('/customers/list/edit', { state })
  }
  const whatsappHandler = () => {
    let win
    let text = 'Berikut kami lampirkan invoice DDR 126'
    let changeNumber
    if (state.phone_number[0] === '0') {
      changeNumber = '62' + state.phone_number.slice(1)
    } else if (state.phone_number[0] === '6' && state.phone_number[1] === '2') {
      changeNumber = state.phone_number
    } else if (state.phone_number[0] !== '0') {
      changeNumber = '62' + state.phone_number
    }

    win = window.open(`https://wa.me/${changeNumber}?text=${text}`, '_blank')

    win.focus()
  }
  const reviewHandler = () => {
    let win
    let text =
      'Terima kasih telah servis kaki kaki mobil kesayangan anda di DDR Motor 126. Bila berkenan beri kami review di Google! Review Google Anda dapat membantu kami untuk terus memberikan pelayanan terbaik untuk Anda https://g.page/r/CSrs8qLbB7emEBE/review Terima kasih!'
    let changeNumber
    if (state.phone_number[0] === '0') {
      changeNumber = '62' + state.phone_number.slice(1)
    } else if (state.phone_number[0] === '6' && state.phone_number[1] === '2') {
      changeNumber = state.phone_number
    } else if (state.phone_number[0] !== '0') {
      changeNumber = '62' + state.phone_number
    }

    win = window.open(`https://wa.me/${changeNumber}?text=${text}`, '_blank')

    win.focus()
  }
  if (refreshTrigger) {
    // console.log("Masuk")
    getInvoices({
      variables: {
        id: state._id,
      },
    })
    setRefreshTrigger(false)
    if (isUpdateStatus) {
      toast.success('Status berhasil diubah')
    } else {
      toast.success('Invoice berhasil dibuat')
    }
    setIsUpdateStatus(false)
  }
  const capitalizeString = (string) => {
    const changeUnderscore = string.replace(/_/g, ' ')
    return changeUnderscore.charAt(0).toUpperCase() + changeUnderscore.slice(1)
  }

  return (
    <CRow>
      <CCol lg="6" sm="12">
        <CCard className="mt-3">
          <CCardHeader>
            <CRow className="d-flex align-items-center justify-content-center">
              <CCol sm="6">
                <h3>Detail Customer</h3>
              </CCol>
              <CCol sm="6">
                <CButton
                  color="warning"
                  className="float-end text-white ms-2 mb-1"
                  onClick={editHandler}
                  size="sm"
                >
                  Edit Customer
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            {state && (
              <table className="table table-striped table-hover">
                <tbody>
                  <tr>
                    <td>Nama</td>
                    <td>{capitalizeString(state.name)}</td>
                  </tr>
                  <tr>
                    <td>No Telepon</td>
                    <td>{`0${state.phone_number}`}</td>
                  </tr>
                  <tr>
                    <td>Merk Mobil</td>
                    <td>
                      {capitalizeString(state.brand)} {capitalizeString(state.type)}
                    </td>
                  </tr>
                  <tr>
                    <td>No Polisi</td>
                    <td>{state.plate_number.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <td>Warna</td>
                    <td>{capitalizeString(state.color)}</td>
                  </tr>
                  <tr>
                    <td>Transmisi</td>
                    <td>{capitalizeString(state.transmission)}</td>
                  </tr>
                  <tr>
                    <td>Tahun</td>
                    <td>{capitalizeString(state.year)}</td>
                  </tr>
                </tbody>
              </table>
            )}
            <CRow className="justify-content-center">
              <CCol lg="6" className="text-end">
                <CButton
                  color="success"
                  variant="outline"
                  className="mb-2 col-lg-6 col-12"
                  onClick={whatsappHandler}
                >
                  Whatsapp
                </CButton>
              </CCol>
              <CCol lg="6" className="text-start">
                <CButton
                  color="danger"
                  variant="outline"
                  className="mb-2 col-lg-6 col-12"
                  onClick={reviewHandler}
                >
                  Review
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol lg="6" sm="12">
        <CCard className="mt-3">
          <CCardHeader>
            <h3>List Invoice</h3>
          </CCardHeader>
          <CCardBody>
            <CRow className="justify-content-center">
              <CCol lg="6">
                <CButton onClick={addNewInvoiceModal} color="primary" className="mb-4 col-12">
                  Tambah Invoice
                </CButton>
              </CCol>
              {user?.role === 'superadmin' && (
                <CCol lg="6">
                  <CButton
                    onClick={addInvoiceBeforeModal}
                    color="success"
                    className="mb-4 col-12 text-white"
                  >
                    Tambah Data Terdahulu
                  </CButton>
                </CCol>
              )}
            </CRow>
            <CRow>
              <CCol lg="12">
                {invoiceList && (
                  <div className="mt-2 float-end">Total data: {invoiceList.length}</div>
                )}
              </CCol>
            </CRow>
            <div className="table-responsive">
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">No Invoice</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tgl Invoice</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Tgl Selesai</CTableHeaderCell>
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
                          {moment(item.estimated_date).format('D MMM YYYY')}
                        </CTableDataCell>
                        <CTableDataCell>
                          {item.ongoing_date ? moment(item.ongoing_date).format('D MMM YYYY') : '-'}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="warning"
                            variant="outline"
                            shape="square"
                            size="sm"
                            className="me-1 mb-1"
                            onClick={() => {
                              changeStatusHandler(item)
                            }}
                          >
                            Ganti Status
                          </CButton>
                          <CButton
                            color="primary"
                            variant="outline"
                            shape="square"
                            size="sm"
                            className="mb-1"
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
            </div>
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
          {updateStatusModal && (
            <InvoiceStatusModal
              item={itemUpdateStatus}
              updateStatusModal={updateStatusModal}
              setUpdateStatusModal={setUpdateStatusModal}
              setRefreshTrigger={setRefreshTrigger}
              setIsUpdateStatus={setIsUpdateStatus}
            />
          )}
          {invoiceBeforeModal && (
            <AddInvoiceBeforeModal
              invoiceBeforeModal={invoiceBeforeModal}
              setInvoiceBeforeModal={setInvoiceBeforeModal}
              id={state._id}
              setRefreshTrigger={setRefreshTrigger}
            />
          )}
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Invoices
