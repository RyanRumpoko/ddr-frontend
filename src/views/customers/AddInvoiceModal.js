import React, { useState, useEffect } from 'react'
import {
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import { gql, useLazyQuery, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

const ADD_INVOICE = gql`
  mutation AddInvoice($input: InvoiceInput) {
    addInvoice(input: $input)
  }
`
const GET_INVOICE_BY_MONTH = gql`
  query GetInvoiceByMonth($input: GetAllInvoiceByMonth) {
    getAllInvoicesByMonth(input: $input)
  }
`
const GET_ALL_SETTING_SERVICE = gql`
  query GetAllSettingService {
    getAllSettingService {
      _id
      service_name
      base_price
    }
  }
`

const AddInvoiceModal = ({ invoiceModal, setInvoiceModal, id, setRefreshTrigger }) => {
  const date = new Date()
  const [values, setValues] = useState({
    invoice_number: '',
    service_bulk: [],
    customer_id: id,
  })
  const [arrayInput, setArrayInput] = useState([
    {
      service_name: '',
      quantity: 0,
      price: 0,
      total: 0,
    },
  ])
  const [settingServiceList, setSettingServiceList] = useState([])
  const romanNumeral = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

  const [addNewInvoice] = useMutation(ADD_INVOICE)
  const [getInvoiceByMonth] = useLazyQuery(GET_INVOICE_BY_MONTH, {
    onCompleted: (data) => {
      const invoice_number = data.getAllInvoicesByMonth + 1
      const month = date.getMonth()
      const year = date.getFullYear().toString().slice(2)
      const monthInRoman = romanNumeral[month]
      setValues({ ...values, invoice_number: `${invoice_number}/DDR/${monthInRoman}/${year}` })
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  const [getAllSettingService] = useLazyQuery(GET_ALL_SETTING_SERVICE, {
    onCompleted: (data) => {
      setSettingServiceList(data.getAllSettingService)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    const monthStart = date.toISOString().slice(0, 7)
    getInvoiceByMonth({
      variables: {
        input: {
          this_month: monthStart,
        },
      },
    })
    getAllSettingService()
    // eslint-disable-next-line
  }, [])

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const addFormFields = () => {
    setArrayInput([...arrayInput, { service_name: '', quantity: 0, price: 0, total: 0 }])
  }
  const removeFormFields = (i) => {
    let newValues = [...arrayInput]
    newValues.splice(i, 1)
    setArrayInput(newValues)
  }
  const errors = []
  const notify = () => {
    for (let i = 0; i < errors.length; i++) {
      return errors[i]
    }
  }
  const onChange = (i, e) => {
    let newValues = [...arrayInput]
    if (e.target.name === 'service_name') {
      newValues[i]['service_name'] = e.target.value
    } else {
      newValues[i][e.target.name] = Number(e.target.value)
    }
    newValues[i]['total'] = newValues[i]['quantity'] * newValues[i]['price']
    setArrayInput(newValues)
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    let total_invoice = 0
    const newArrayInput = arrayInput.map((el) => {
      total_invoice += el.total
      const getServiceId = settingServiceList.find(
        (item) => item.service_name === el.service_name.toLocaleLowerCase(),
      )
      if (!getServiceId) {
        return errors.push(
          toast.error(`Nama setting "${el.service_name.toLocaleLowerCase()}" belum terdaftar`),
        )
      } else return { ...el, service_name: getServiceId._id }
    })
    if (errors.length > 0) {
      notify()
    } else {
      try {
        await addNewInvoice({
          variables: {
            input: { ...values, service_bulk: newArrayInput, total_invoice },
          },
        })
        setRefreshTrigger(true)
        setInvoiceModal(false)
      } catch (error) {
        toast.error(error.graphQLErrors[0].message)
      }
    }
  }
  return (
    <CModal
      size="lg"
      visible={invoiceModal}
      onClose={() => setInvoiceModal(false)}
      backdrop="static"
    >
      <CModalHeader closeButton>
        <CModalTitle>Tambah Invoice Baru</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          {arrayInput.map((el, idx) => (
            <CRow className="mb-3 justify-content-center" key={idx}>
              <CCol sm="3" className="pb-2">
                {settingServiceList && settingServiceList.length !== 0 && (
                  <>
                    <CFormInput
                      list="dataService"
                      placeholder="Nama Barang"
                      name="service_name"
                      value={el.service_name}
                      onChange={(e) => onChange(idx, e)}
                      required
                    />
                    <datalist id="dataService">
                      {settingServiceList.map((item) => (
                        <option key={item._id} value={item._service_name}>
                          {capitalizeString(item.service_name)}
                        </option>
                      ))}
                    </datalist>
                  </>
                )}
              </CCol>
              <CCol sm="2" className="pb-2">
                <CFormInput
                  type="text"
                  placeholder="Jumlah"
                  name="quantity"
                  value={el.quantity}
                  onChange={(e) => onChange(idx, e)}
                  required
                />
              </CCol>
              <CCol sm="3" className="pb-2">
                <CFormInput
                  type="text"
                  placeholder="Harga"
                  name="price"
                  value={el.price}
                  onChange={(e) => onChange(idx, e)}
                  required
                />
              </CCol>
              <CCol sm="3">
                <div className="py-2 text-bold">
                  {el.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </div>
              </CCol>
              <CCol sm="1">
                <button
                  className="py-2"
                  style={{ border: 'none', backgroundColor: ' transparent' }}
                  onClick={() => removeFormFields(idx)}
                  type="button"
                >
                  <i className="fas fa-minus-circle fa-lg"></i>
                </button>
              </CCol>
            </CRow>
          ))}
          <CRow className="justify-content-center">
            <CCol sm="6" className="mb-3 text-center">
              <button
                style={{ border: 'none', backgroundColor: ' transparent' }}
                onClick={() => addFormFields()}
              >
                <i className="fas fa-plus-circle fa-lg"></i>
              </button>
            </CCol>
          </CRow>
          <CRow className="justify-content-center">
            <CCol sm="6">
              <CButton color="success" type="submit" className="col-12 text-white">
                Buat Invoice
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      {/* <ToastContainer /> */}
    </CModal>
  )
}

export default AddInvoiceModal
