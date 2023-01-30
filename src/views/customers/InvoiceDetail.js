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
import axios from 'axios'
import FileSaver from 'file-saver'
import EditServiceModal from './EditServiceModal'
import DeleteServiceModal from './DeleteServiceModal'
import AddServiceModal from './AddServiceModal'
// import XLSX from 'sheetjs-style'

const routing = process.env.REACT_APP_REST_ENDPOINT_CYCLIC

const GET_SERVICES_BY_INVOICE_ID = gql`
  query GetServicesByInvoiceId($id: ID) {
    getServicesByInvoiceId(id: $id) {
      _id
      service_name {
        _id
        service_name
      }
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
  const [isDisc, setIsDisc] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [editId, setEditId] = useState('')
  const [deleteId, setDeleteId] = useState('')
  const [dataDisc, setDataDisc] = useState()

  const { loading, refetch } = useQuery(GET_SERVICES_BY_INVOICE_ID, {
    onCompleted: (data) => {
      let totalDisc = 0
      let total = 0
      const newServiceData = []

      data.getServicesByInvoiceId.forEach((item) => {
        if (item.service_name.service_name === 'discount') {
          totalDisc = item.total
          setDataDisc(item)
        } else {
          total += item.total
          newServiceData.push(item)
        }
      })

      if (totalDisc === 0) {
        setDataDisc()
      }
      setServiceList(newServiceData)
      setInvoiceTotal(total - totalDisc)
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
    if (_id === 'discount') {
      setEditId(dataDisc._id)
      setIsDisc(!isDisc)
    } else {
      setEditId(_id)
    }
    setEditServiceModal(!editServiceModal)
  }
  const deleteHandler = ({ _id }) => {
    if (_id === 'discount') {
      setDeleteId(dataDisc._id)
      setIsDisc(!isDisc)
    } else {
      setDeleteId(_id)
    }
    setDeleteModal(!deleteModal)
  }
  const addHandler = () => {
    setAddServiceModal(!addServiceModal)
  }
  const addDiscHandler = () => {
    setIsDisc(!isDisc)
    setAddServiceModal(!addServiceModal)
  }
  const downloadHandler = async (e) => {
    e.preventDefault()

    console.log(serviceList)
    // const fileType =
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    // const fileExtension = '.xlsx'
    // const excelData = [
    //   {
    //     'First Name': 'Arul',
    //     'Last Name': 'Prasath',
    //   },
    //   {
    //     'First Name': 'Balu',
    //     'Last Name': 'Subramani',
    //   },
    // ]

    // const ws = XLSX.utils.json_to_sheet(serviceList)
    // const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    // const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    // const data = new Blob([excelBuffer], { type: fileType })
    // FileSaver.saveAs(data, 'Excel Export' + fileExtension)

    await axios
      .post(
        `${routing}download/invoice`,
        {
          _id: state._id,
        },
        {
          responseType: 'arraybuffer',
        },
      )
      .then((data) => {
        let blob = new Blob([data.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        const dateNow = new Date()
        const month =
          dateNow.getMonth() + 1 < 10 ? `0${dateNow.getMonth() + 1}` : dateNow.getMonth() + 1
        const date = dateNow.getDate() < 10 ? `0${dateNow.getDate()}` : dateNow.getDate()
        const year = dateNow.getFullYear()
        const pattern = /\//g
        const fileName = `invoice-${state.invoice_number
          .toLowerCase()
          .replace(pattern, '')}-${date}${month}${year}`
        FileSaver.saveAs(blob, fileName)
      })
      .catch((err) => {
        console.log(err)
      })
  }
  if (refreshTrigger) {
    refetch()
    setRefreshTrigger(false)
    setIsDisc(false)
    toast.success('Invoice berhasil di update')
  }

  return (
    <CCard className="mt-3">
      <CCardHeader>
        <CRow className="d-flex align-items-center justify-content-center">
          <CCol sm="8">
            <h3>List Service Invoice {state.invoice_number}</h3>
          </CCol>
          <CCol sm="4">
            <CButton
              color="warning"
              className="float-end text-white ms-2 mb-1"
              onClick={() => setEditMode(!editMode)}
              size="sm"
            >
              Mode Edit
            </CButton>
            <CButton
              color="success"
              className="float-end text-white mb-1"
              style={{ width: '80px' }}
              onClick={addDiscHandler}
              size="sm"
            >
              Discount
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
          <CCol lg="6">
            <CButton
              size="sm"
              color="info text-white"
              onClick={downloadHandler}
              disabled={state.status !== 'done'}
            >
              Download Invoice
            </CButton>
          </CCol>
          <CCol lg="6">
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
                  <CTableDataCell>
                    {capitalizeString(item.service_name.service_name)}
                  </CTableDataCell>
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
              <CTableDataCell colSpan={5} />
              <CTableDataCell colSpan={2} />
            </CTableRow>
            {!loading && dataDisc && (
              <CTableRow>
                <CTableDataCell colSpan={3} />
                <CTableDataCell color="danger">Discount</CTableDataCell>
                <CTableDataCell color="danger">{localString(dataDisc.total)}</CTableDataCell>
                <CTableDataCell color="danger">
                  <CButton
                    size="sm"
                    hidden={editMode}
                    color="warning"
                    className="text-white me-1 mb-1"
                    onClick={() => editHandler({ _id: 'discount' })}
                  >
                    Edit
                  </CButton>
                  <CButton
                    size="sm"
                    hidden={editMode}
                    color="danger"
                    className="text-white mb-1"
                    onClick={() => deleteHandler({ _id: 'discount' })}
                  >
                    Hapus
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            )}
            <CTableRow>
              <CTableDataCell colSpan={3} />
              <CTableDataCell color="success">Total Biaya</CTableDataCell>
              <CTableDataCell color="success">{localString(invoiceTotal)}</CTableDataCell>
              <CTableDataCell colSpan={2} color="success" />
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
          isDisc={isDisc}
          setIsDisc={setIsDisc}
        />
      )}
      {deleteModal && deleteId && (
        <DeleteServiceModal
          _id={deleteId}
          deleteModal={deleteModal}
          setDeleteModal={setDeleteModal}
          setRefreshTrigger={setRefreshTrigger}
          isDisc={isDisc}
          setIsDisc={setIsDisc}
        />
      )}
      {addServiceModal && (
        <AddServiceModal
          invoice_id={state._id}
          addServiceModal={addServiceModal}
          setAddServiceModal={setAddServiceModal}
          setRefreshTrigger={setRefreshTrigger}
          isDisc={isDisc}
          setIsDisc={setIsDisc}
        />
      )}
      <ToastContainer />
    </CCard>
  )
}

export default InvoiceDetail
