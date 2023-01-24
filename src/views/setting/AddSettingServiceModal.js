import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import { gql, useMutation } from '@apollo/client'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const ADD_SETTING_SERVICE = gql`
  mutation AddSettingService($input: SettingServiceInput) {
    addSettingService(input: $input) {
      _id
    }
  }
`

const AddSettingServiceModal = ({
  settingServiceModal,
  setSettingServiceModal,
  setRefreshTrigger,
}) => {
  const [values, setValues] = useState({
    service_name: '',
    base_price: '0',
    service_type: '',
  })

  const [addSettingService] = useMutation(ADD_SETTING_SERVICE)

  const errors = []
  const notify = () => {
    for (let i = 0; i < errors.length; i++) {
      return errors[i]
    }
  }

  const onChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    if (!values.service_name) {
      errors.push(toast.error('Nama service tidak boleh kosong'))
    }
    if (!values.service_type) {
      errors.push(toast.error('Jenis service tidak boleh kosong'))
    }
    if (!values.base_price) {
      errors.push(toast.error('Harga dasar tidak boleh kosong'))
    }

    if (errors.length > 0) {
      notify()
    } else {
      try {
        await addSettingService({
          variables: {
            input: { ...values, base_price: Number(values.base_price) },
          },
        })
        setValues({
          service_name: '',
          base_price: '0',
          confirm_password: '',
        })
        setRefreshTrigger(true)
        setSettingServiceModal(false)
      } catch (error) {
        toast.error(error.graphQLErrors[0].message)
      }
    }
  }
  return (
    <CModal
      visible={settingServiceModal}
      onClose={() => setSettingServiceModal(false)}
      backdrop="static"
    >
      <CModalHeader closeButton>
        <CModalTitle>Tambah User Baru</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <CFormLabel>Nama Service</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Nama service"
              name="service_name"
              value={values.service_name}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <CFormLabel>Harga Dasar</CFormLabel>
            <CFormInput
              type="text"
              placeholder="0"
              name="base_price"
              value={values.base_price}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group mb-3">
            <CFormLabel>Jenis Service</CFormLabel>
            <CFormSelect
              name="service_type"
              value={values.service_type}
              onChange={onChange}
              options={[
                '- Pilih Jenis Jasa -',
                { label: 'Jasa', value: 'service' },
                { label: 'Non Jasa', value: 'non-service' },
              ]}
              required
            />
          </div>
          <CRow className="justify-content-center">
            <CCol md="6">
              <CButton color="success" type="submit" className="col-12 text-white">
                Tambah
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <ToastContainer />
    </CModal>
  )
}

export default AddSettingServiceModal
