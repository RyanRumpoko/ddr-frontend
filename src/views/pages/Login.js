import React, { useState, useContext } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { gql, useMutation } from '@apollo/client'
import { AuthContext } from 'src/context/auth'

const LOGIN = gql`
  mutation Login($input: LoginInput) {
    login(input: $input) {
      _id
      username
      token
    }
  }
`

const Login = () => {
  const context = useContext(AuthContext)
  const [values, setValues] = useState({
    username: '',
    password: '',
  })

  const errors = []
  const notify = () => {
    for (let i = 0; i < errors.length; i++) {
      return errors[i]
    }
  }
  let navigate = useNavigate()

  const [login] = useMutation(LOGIN, {
    update(_, { data: { login: userDataAdmin } }) {
      context.login(userDataAdmin)
      navigate('/')
    },
    // onCompleted: (data) => {
    //   console.log(data.login)
    //   navigate('/')
    // },
    onError(err) {
      toast.error(err.graphQLErrors[0].message)
    },
    variables: {
      input: {
        username: values.username.toString().trim().toLowerCase(),
        password: values.password,
      },
    },
  })

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }
  const onSubmit = async (e) => {
    e.preventDefault()

    if (!values.username) {
      errors.push(toast.error('Username cannot be empty'))
    }
    if (!values.password) {
      errors.push(toast.error('Password cannot be empty'))
    }

    if (errors.length > 0) {
      notify()
    } else {
      await login()
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="5">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onSubmit}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={values.username}
                        onChange={onChange}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={values.password}
                        onChange={onChange}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol md="12">
                        <CButton type="submit" color="primary" className="px-4 col-12">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  <CRow>
                    <CCol md="12" className="mt-2">
                      <span className="float-end">Ver. {process.env.REACT_APP_VERSION}</span>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
      <ToastContainer />
    </div>
  )
}

export default Login
