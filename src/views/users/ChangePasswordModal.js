import React, { useState } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CButton,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CRow,
  CCol,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useMutation, gql } from '@apollo/client'

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($input: ChangePasswordInput) {
    changePassword(input: $input)
  }
`

const ChangePasswordModal = ({
  _id,
  modalChangePassword,
  setModalChangePassword,
  setToastTrigger,
}) => {
  const [values, setValues] = useState({
    _id,
    new_password: '',
    confirm_password: '',
  })

  const [changePassword] = useMutation(CHANGE_PASSWORD)

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    if (!values.new_password && !values.confirm_password) {
      toast.error('Password cannot be empty')
      toast.error('Confirm Password cannot be empty')
    } else if (!values.new_password) {
      toast.error('Password cannot be empty')
    } else if (!values.confirm_password) {
      toast.error('Confirm Password cannot be empty')
    } else if (values.new_password !== values.confirm_password) {
      toast.error('Password must be match')
    } else {
      try {
        await changePassword({
          variables: {
            input: {
              _id: values._id,
              password: values.new_password,
            },
          },
        })
        setToastTrigger(true)
        setModalChangePassword(false)
      } catch (error) {
        console.log(error)
      }
    }
  }
  return (
    <>
      <CModal
        visible={modalChangePassword}
        onClose={() => setModalChangePassword(false)}
        backdrop="static"
      >
        <CModalHeader closeButton>
          <CModalTitle>Ganti Password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={onSubmit}>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Password"
                name="new_password"
                value={values.new_password}
                onChange={onChange}
              />
            </CInputGroup>
            <CInputGroup className="mb-3">
              <CInputGroupText>
                <CIcon icon={cilLockLocked} />
              </CInputGroupText>
              <CFormInput
                type="password"
                placeholder="Confirm Password"
                name="confirm_password"
                value={values.confirm_password}
                onChange={onChange}
              />
            </CInputGroup>
            <CRow className="justify-content-center">
              <CCol md="6">
                <CButton color="success" type="submit" className="col-12 text-white">
                  <i className="fas fa-save "></i> Simpan
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
      </CModal>
    </>
  )
}

export default ChangePasswordModal
