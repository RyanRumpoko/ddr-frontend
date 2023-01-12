import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from 'src/context/auth'

const AuthRoute = ({ children }) => {
  const { user } = useContext(AuthContext)
  const checkToken = localStorage.getItem('jwtToken')

  if (!checkToken && !user) {
    return <Navigate to="/login" />
  }
  return children
}

const AuthLogin = ({ children }) => {
  const { user } = useContext(AuthContext)
  const checkToken = localStorage.getItem('jwtToken')

  if (checkToken && user) {
    return <Navigate to="/" />
  }
  return children
}

export { AuthRoute, AuthLogin }
