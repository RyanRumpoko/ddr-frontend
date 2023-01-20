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

const ADD_USER = gql`
  mutation AddUser($input: UserInput) {
    addUser(input: $input) {
      _id
      username
    }
  }
`

const AddUserModal = ({ userModal, setUserModal, setRefreshTrigger }) => {
  const [values, setValues] = useState({
    username: '',
    role: '',
    password: '',
    confirm_password: '',
  })

  const [addNewUser] = useMutation(ADD_USER)

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

    if (!values.username) {
      errors.push(toast.error('Username cannot be empty'))
    } else if (/\s/.test(values.username)) {
      errors.push(toast.error('Username cannot contain whitespace'))
    }
    if (!values.role) {
      errors.push(toast.error('Role cannot be empty'))
    }
    if (!values.password) {
      errors.push(toast.error('Password cannot be empty'))
    } else if (values.password !== values.confirm_password) {
      errors.push(toast.error('Password must be match'))
    }

    if (errors.length > 0) {
      notify()
    } else {
      try {
        await addNewUser({
          variables: {
            input: {
              username: values.username.toString().trim().toLowerCase(),
              password: values.password,
              role: values.role,
            },
          },
        })
        setValues({
          username: '',
          password: '',
          confirm_password: '',
        })
        setRefreshTrigger(true)
        setUserModal(false)
      } catch (error) {
        toast.error(error.graphQLErrors[0].message)
      }
    }
  }
  return (
    <CModal visible={userModal} onClose={() => setUserModal(false)} backdrop="static">
      <CModalHeader closeButton>
        <CModalTitle>Add New User</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <CFormLabel>Username</CFormLabel>
            <CFormInput
              type="text"
              placeholder="Username"
              name="username"
              value={values.username}
              onChange={onChange}
            />
            <small className="form-text text-danger ml-2">*Required</small>
          </div>
          <div className="form-group mb-3">
            <CFormLabel>Role</CFormLabel>
            <CFormSelect
              name="role"
              value={values.role}
              onChange={onChange}
              options={[
                '- Select Role -',
                { label: 'Superadmin', value: 'superadmin' },
                { label: 'Admin', value: 'admin' },
              ]}
            ></CFormSelect>
            <small className="form-text text-danger ml-2">*Required</small>
          </div>
          <div className="form-group mb-3">
            <CFormLabel>Password</CFormLabel>
            <CFormInput
              type="password"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={onChange}
            />
            <small className="form-text text-danger ml-2">*Required</small>
          </div>
          <div className="form-group mb-3">
            <CFormLabel>Confirm Password</CFormLabel>
            <CFormInput
              type="password"
              placeholder="Confirm Password"
              name="confirm_password"
              value={values.confirm_password}
              onChange={onChange}
            />
            <small className="form-text text-danger ml-2">*Required</small>
          </div>
          <CRow className="justify-content-center">
            <CCol md="6">
              <CButton color="success" type="submit" className="col-12 text-white">
                Create
              </CButton>
            </CCol>
          </CRow>
        </CForm>
      </CModalBody>
      <ToastContainer />
    </CModal>
  )
}

export default AddUserModal
