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
import { gql, useMutation, useLazyQuery } from '@apollo/client'
import { toast } from 'react-toastify'

const ADD_SERVICE = gql`
  mutation AddService($input: ServiceInput) {
    addService(input: $input) {
      _id
    }
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

const AddServiceModal = ({
  invoice_id,
  addServiceModal,
  setAddServiceModal,
  setRefreshTrigger,
  isDisc,
  setIsDisc,
}) => {
  const [values, setValues] = useState({
    service_name: '',
    quantity: 0,
    price: 0,
    total: 0,
  })
  const [settingServiceList, setSettingServiceList] = useState([])

  const [addService] = useMutation(ADD_SERVICE)
  const [getSettingService, { loading: loadingSetting }] = useLazyQuery(GET_ALL_SETTING_SERVICE, {
    onCompleted: (data) => {
      setSettingServiceList(data.getAllSettingService)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })

  useEffect(() => {
    if (isDisc) {
      setValues({ ...values, service_name: 'Discount', quantity: 1 })
    }
    getSettingService()
    // eslint-disable-next-line
  }, [])

  const errors = []
  const notify = () => {
    for (let i = 0; i < errors.length; i++) {
      return errors[i]
    }
  }
  const validate = () => {
    if (!values.service_name) {
      errors.push(toast.error('Nama barang tidak boloh kosong'))
    }
    if (!values.quantity) {
      errors.push(toast.error('Jumlah tidak boloh kosong'))
    }
    if (!values.price) {
      errors.push(toast.error('Harga tidak boloh kosong'))
    }
    if (!values.total) {
      errors.push(toast.error('Total tidak boloh kosong'))
    }
  }

  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const onCloseHandler = () => {
    setIsDisc(false)
    setAddServiceModal(false)
  }
  const onChange = (e) => {
    if (e.target.name === 'service_name') {
      setValues({ ...values, [e.target.name]: e.target.value })
    } else if (e.target.name === 'quantity') {
      setValues({
        ...values,
        [e.target.name]: Number(e.target.value),
        total: e.target.value * values.price,
      })
    } else if (e.target.name === 'price') {
      setValues({
        ...values,
        [e.target.name]: Number(e.target.value),
        total: values.quantity * e.target.value,
      })
    }
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    validate()

    const getServiceId = settingServiceList.find(
      (item) => item.service_name === values.service_name.toLocaleLowerCase(),
    )
    if (!getServiceId)
      errors.push(
        toast.error(`Nama setting "${values.service_name.toLocaleLowerCase()}" belum terdaftar`),
      )
    if (!isDisc && values.service_name.toLocaleLowerCase() === 'discount') {
      errors.push(toast.error(`Tidak dapat menambahkan diskon disini`))
    }

    if (errors.length > 0) {
      notify()
    } else {
      try {
        await addService({
          variables: {
            input: {
              ...values,
              service_name: getServiceId._id,
              invoice_id,
              is_disc: isDisc,
            },
          },
        })
        setRefreshTrigger(true)
        setAddServiceModal(false)
      } catch (error) {
        toast.error(error.graphQLErrors[0].message)
      }
    }
  }
  return (
    <CModal size="lg" visible={addServiceModal} onClose={onCloseHandler} backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>{isDisc ? 'Tambah Diskon' : 'Tambah Service'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          <CRow className="mb-3 justify-content-center">
            <CCol sm="3" className="pb-2">
              {!loadingSetting && settingServiceList && settingServiceList.length !== 0 && !isDisc && (
                <>
                  <CFormInput
                    list="dataService"
                    placeholder="Nama Barang"
                    name="service_name"
                    value={values.service_name}
                    onChange={onChange}
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
              {isDisc && (
                <CFormInput
                  type="text"
                  placeholder="Nama Barang"
                  name="service_name"
                  value={values.service_name}
                  onChange={onChange}
                  disabled={isDisc}
                  required
                />
              )}
            </CCol>
            <CCol sm="2" className="pb-2">
              <CFormInput
                type="text"
                placeholder="Jumlah"
                name="quantity"
                value={values.quantity}
                onChange={onChange}
                disabled={isDisc}
                required
              />
            </CCol>
            <CCol sm="3" className="pb-2">
              <CFormInput
                type="text"
                placeholder="Harga"
                name="price"
                value={values.price}
                onChange={onChange}
                required
              />
            </CCol>
            <CCol sm="3">
              <div className="py-2 text-bold">
                {values.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </div>
            </CCol>
          </CRow>
          <CRow className="justify-content-center">
            <CCol sm="6">
              <CButton color="success" type="submit" className="col-12 text-white">
                Simpan
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default AddServiceModal
