import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: UpdateCustomerInput) {
    updateCustomer(input: $input) {
      _id
    }
  }
`

const GET_ALL_SETTING_BRAND = gql`
  query GetAllSettingBrand {
    getAllSettingBrand {
      _id
      brand_name
    }
  }
`

const GET_CUSTOMER_BY_ID = gql`
  query GetCustomerById($_id: ID) {
    getCustomerById(_id: $_id) {
      _id
      name
      phone_number
      brand
      type
      plate_number
      color
      transmission
      year
    }
  }
`

const EditCustomer = () => {
  const { state } = useLocation()
  let navigate = useNavigate()

  const [values, setValues] = useState({
    name: '',
    phone_number: '',
    brand: '',
    type: '',
    year: '',
    transmission: '',
    color: '',
    plate_number: '',
  })
  const [settingBrandList, setSettingBrandList] = useState()

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER)
  const { loading: loadingSetting } = useQuery(GET_ALL_SETTING_BRAND, {
    onCompleted: (data) => {
      setSettingBrandList(data.getAllSettingBrand)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
  })
  const { loading: loadingCustomer } = useQuery(GET_CUSTOMER_BY_ID, {
    onCompleted: (data) => {
      setValues(data.getCustomerById)
    },
    onError(err) {
      console.log(err)
    },
    fetchPolicy: 'cache-and-network',
    variables: {
      _id: state._id,
    },
  })

  const errors = []
  const notify = () => {
    for (let i = 0; i < errors.length; i++) {
      return errors[i]
    }
  }
  const validate = () => {
    if (!values.name) {
      errors.push(toast.error('Name tidak boloh kosong'))
    }
    if (!values.phone_number) {
      errors.push(toast.error('Nomor telepon tidak boloh kosong'))
    }
    if (!values.brand) {
      errors.push(toast.error('Merk tidak boloh kosong'))
    }
    if (!values.type) {
      errors.push(toast.error('Tipe tidak boloh kosong'))
    }
    if (!values.year) {
      errors.push(toast.error('Tahun tidak boloh kosong'))
    }
    if (!values.transmission) {
      errors.push(toast.error('Transmisi tidak boloh kosong'))
    }
    if (!values.color) {
      errors.push(toast.error('Warna tidak boloh kosong'))
    }
    if (!values.plate_number) {
      errors.push(toast.error('Nomor polisi tidak boloh kosong'))
    }
  }
  const capitalizeString = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    validate()
    if (errors.length > 0) {
      notify()
    } else {
      try {
        await updateCustomer({
          variables: {
            input: {
              _id: state._id,
              name: values.name,
              phone_number: values.phone_number,
              brand: values.brand,
              type: values.type,
              year: values.year,
              transmission: values.transmission,
              color: values.color,
              plate_number: values.plate_number,
            },
          },
        })
        navigate('/customers/list')
        toast.success('Customer berhasil ditambahkan')
      } catch (error) {
        toast.error(error.graphQLErrors[0].message)
      }
    }
  }
  return (
    <CCard>
      <CCardHeader>
        <h3>Edit Customer</h3>
      </CCardHeader>
      <CCardBody>
        {!loadingCustomer && (
          <CForm onSubmit={onSubmit}>
            <CRow>
              <CCol sm="4" className="border-bottom mt-3">
                <h5>Data Customer</h5>
              </CCol>
            </CRow>
            <CRow className="my-3">
              <CCol sm="2">Nama</CCol>
              <CCol sm="4">
                <CFormInput
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={(e) => onChange(e)}
                />
              </CCol>
              <CCol sm="2">Nomor Telepon</CCol>
              <CCol sm="4">
                <CFormInput
                  type="text"
                  name="phone_number"
                  value={values.phone_number}
                  onChange={(e) => onChange(e)}
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="4" className="border-bottom mt-3">
                <h5>Data Kendaraan</h5>
              </CCol>
            </CRow>
            <CRow className="my-3">
              <CCol sm="2">Nomor Polisi</CCol>
              <CCol sm="4">
                <CFormInput
                  type="text"
                  name="plate_number"
                  value={values.plate_number}
                  onChange={(e) => onChange(e)}
                />
              </CCol>
              <CCol sm="2">Merk</CCol>
              <CCol sm="4">
                {!loadingSetting && settingBrandList && (
                  <>
                    <CFormInput
                      list="dataService"
                      type="text"
                      name="brand"
                      value={values.brand}
                      onChange={(e) => onChange(e)}
                    />
                    <datalist id="dataService">
                      {settingBrandList.map((item) => (
                        <option key={item._id} value={item._brand_name}>
                          {capitalizeString(item.brand_name)}
                        </option>
                      ))}
                    </datalist>
                  </>
                )}
              </CCol>
            </CRow>
            <CRow className="my-3">
              <CCol sm="2">Tipe</CCol>
              <CCol sm="4">
                <CFormInput
                  type="text"
                  name="type"
                  value={values.type}
                  onChange={(e) => onChange(e)}
                />
              </CCol>
              <CCol sm="2">Tahun</CCol>
              <CCol sm="4">
                <CFormInput
                  type="text"
                  name="year"
                  value={values.year}
                  onChange={(e) => onChange(e)}
                />
              </CCol>
            </CRow>
            <CRow className="my-3">
              <CCol sm="2">Warna</CCol>
              <CCol sm="4">
                <CFormInput
                  type="text"
                  name="color"
                  value={values.color}
                  onChange={(e) => onChange(e)}
                />
              </CCol>
              <CCol sm="2">Transmisi</CCol>
              <CCol sm="4">
                <CFormSelect
                  name="transmission"
                  value={values.transmission}
                  onChange={(e) => onChange(e)}
                  options={[
                    '- Pilih Transmisi -',
                    { label: 'Manual', value: 'manual' },
                    { label: 'Automatic', value: 'automatic' },
                  ]}
                />
              </CCol>
            </CRow>
            <CRow className="justify-content-between">
              <CCol sm="12">
                <div className="mt-3 text-center">
                  <CButton type="submit" color="success" className="text-white col-6">
                    <i className="fas fa-save"></i> Simpan
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CForm>
        )}
      </CCardBody>
      <ToastContainer />
    </CCard>
  )
}

export default EditCustomer
