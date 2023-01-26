import React, { useState } from 'react'
import {
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
  CCol,
  CButton,
} from '@coreui/react'
import { gql, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'

const ADD_SETTING_BRAND = gql`
  mutation AddSettingBrand($input: SettingBrandInput) {
    addSettingBrand(input: $input) {
      _id
    }
  }
`

const AddSettingBrandModal = ({ settingBrandModal, setSettingBrandModal, setRefreshTrigger }) => {
  const [values, setValues] = useState({
    brand_name: '',
  })

  const [addSettingBrand] = useMutation(ADD_SETTING_BRAND)

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

    if (!values.brand_name) {
      errors.push(toast.error('Nama brand tidak boleh kosong'))
    }

    if (errors.length > 0) {
      notify()
    } else {
      try {
        await addSettingBrand({
          variables: {
            input: values,
          },
        })
        setValues({
          brand_name: '',
        })
        setRefreshTrigger(true)
        setSettingBrandModal(false)
      } catch (error) {
        toast.error(error.graphQLErrors[0].message)
      }
    }
  }
  return (
    <CModal
      visible={settingBrandModal}
      onClose={() => setSettingBrandModal(false)}
      backdrop="static"
    >
      <CModalHeader closeButton>
        <CModalTitle>Tambah Setting Brand Baru</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <CFormLabel>Nama Brand</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Nama brand"
              name="brand_name"
              value={values.brand_name}
              onChange={onChange}
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
    </CModal>
  )
}

export default AddSettingBrandModal
