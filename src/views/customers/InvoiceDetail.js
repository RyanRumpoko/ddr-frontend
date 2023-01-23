import React, { useState } from 'react'
import {
  // CButton,
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

  const { loading } = useQuery(GET_SERVICES_BY_INVOICE_ID, {
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

  return (
    <CCard className="mt-3">
      <CCardHeader>
        <h3>List Service Invoice {state.invoice_number} </h3>
      </CCardHeader>
      <CCardBody>
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
                </CTableRow>
              ))}
          </CTableBody>
          <CTableHead>
            <CTableRow>
              <CTableDataCell colSpan={5}></CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell colSpan={3}></CTableDataCell>
              <CTableDataCell color="success">Total Biaya</CTableDataCell>
              <CTableDataCell color="success">{localString(invoiceTotal)}</CTableDataCell>
            </CTableRow>
          </CTableHead>
        </CTable>
      </CCardBody>
    </CCard>
  )
}

export default InvoiceDetail
