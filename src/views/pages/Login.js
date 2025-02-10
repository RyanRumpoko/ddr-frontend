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
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { gql, useMutation } from '@apollo/client'
import { AuthContext } from 'src/context/auth'

const LOGIN = gql`
  mutation Login($input: LoginInput) {
    login(input: $input) {
      _id
      username
      token
      role
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
          <CCol lg="5" sm="12">
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
                        required
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
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol sm="12">
                        <CButton type="submit" color="primary" className="px-4 col-12 text-white">
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                  <CRow>
                    <CCol sm="12" className="mt-2">
                      <span className="float-end">Ver. 1.3.0</span>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
