import React, { useState } from 'react'
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
import { useLocation } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'
import { toast, ToastContainer } from 'react-toastify'
import EditServiceModal from './EditServiceModal'
import DeleteServiceModal from './DeleteServiceModal'
import AddServiceModal from './AddServiceModal'

const GET_SERVICES_BY_INVOICE_ID = gql`
  query GetServicesByInvoiceId($id: ID) {
    getServicesByInvoiceId(id: $id) {
      _id
      service_name
      quantity
      price
      total
    }
  }
`

const InvoiceDetail = () => {
  const { state } = useLocation()
  const [serviceList, setServiceList] = useState([])
  const [invoiceTotal, setInvoiceTotal] = useState(0)
  const [editMode, setEditMode] = useState(true)
  const [editServiceModal, setEditServiceModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [addServiceModal, setAddServiceModal] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')

  const { loading, refetch } = useQuery(GET_SERVICES_BY_INVOICE_ID, {
    onCompleted: (data) => {
      let total = 0
      data.getServicesByInvoiceId.forEach((item) => {
        total += item.total
      })
      setServiceList(data.getServicesByInvoiceId)
      setInvoiceTotal(total)
    },
    onError(err) {
      console.log(err)
    },
    variables: { id: state._id },
    fetchPolicy: 'cache-and-network',
  })

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const localString = (number) => {
    return number.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })
  }
  const editHandler = ({ _id }) => {
    setEditId(_id)
    setEditServiceModal(!editServiceModal)
  }
  const deleteHandler = ({ _id }) => {
    setDeleteId(_id)
    setDeleteModal(!deleteModal)
  }
  const addHandler = () => {
    setAddServiceModal(!addServiceModal)
  }
  if (refreshTrigger) {
    refetch()
    setRefreshTrigger(false)
    toast.success('Invoice berhasil di update')
  }

  return (
    <CCard className="mt-3">
      <CCardHeader>
        <CRow className="d-flex align-items-center">
          <CCol lg="6">
            <h3>List Service Invoice {state.invoice_number}</h3>
          </CCol>
          <CCol lg="6">
            <CButton
              color="warning"
              className="float-end text-white"
              onClick={() => setEditMode(!editMode)}
              size="sm"
            >
              Mode Edit
            </CButton>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody>
        <CRow className="justify-content-center">
          <CCol sm="6" className="mb-3 text-center">
            <CButton
              size="sm"
              hidden={editMode}
              color="primary col-6 text-white"
              onClick={addHandler}
            >
              Tambah Data
            </CButton>
          </CCol>
        </CRow>
        <CRow>
          <CCol lg="12">
            {serviceList && <div className="mt-2 float-end">Total data: {serviceList.length}</div>}
          </CCol>
        </CRow>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">#</CTableHeaderCell>
              <CTableHeaderCell scope="col">Nama Barang</CTableHeaderCell>
              <CTableHeaderCell scope="col">Jumlah</CTableHeaderCell>
              <CTableHeaderCell scope="col">Harga</CTableHeaderCell>
              <CTableHeaderCell scope="col">Total</CTableHeaderCell>
              <CTableHeaderCell scope="col"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {!loading &&
              serviceList &&
              serviceList.length !== 0 &&
              serviceList.map((item, idx) => (
                <CTableRow key={item._id}>
                  <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                  <CTableDataCell>{capitalizeString(item.service_name)}</CTableDataCell>
                  <CTableDataCell>{item.quantity}</CTableDataCell>
                  <CTableDataCell>{localString(item.price)}</CTableDataCell>
                  <CTableDataCell>{localString(item.total)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      size="sm"
                      hidden={editMode}
                      color="warning"
                      className="text-white me-1 mb-1"
                      onClick={() => editHandler(item)}
                    >
                      Edit
                    </CButton>
                    <CButton
                      size="sm"
                      hidden={editMode}
                      color="danger"
                      className="text-white mb-1"
                      onClick={() => deleteHandler(item)}
                    >
                      Hapus
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
          </CTableBody>
          <CTableHead>
            <CTableRow>
              <CTableDataCell colSpan={5}></CTableDataCell>
              <CTableDataCell colSpan={2}></CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell colSpan={3}></CTableDataCell>
              <CTableDataCell color="success">Total Biaya</CTableDataCell>
              <CTableDataCell color="success">{localString(invoiceTotal)}</CTableDataCell>
              <CTableDataCell colSpan={2} color="success"></CTableDataCell>
            </CTableRow>
          </CTableHead>
        </CTable>
      </CCardBody>
      {editServiceModal && editId && (
        <EditServiceModal
          _id={editId}
          editServiceModal={editServiceModal}
          setEditServiceModal={setEditServiceModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      {deleteModal && deleteId && (
        <DeleteServiceModal
          _id={deleteId}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      {addServiceModal && (
        <AddServiceModal
          invoice_id={state._id}
          addServiceModal={addServiceModal}
          setAddServiceModal={setAddServiceModal}
          setRefreshTrigger={setRefreshTrigger}
        />
      )}
      <ToastContainer />
    </CCard>
  )
}

export default InvoiceDetail
