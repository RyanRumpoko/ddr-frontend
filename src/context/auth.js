import React, { createContext, useReducer } from 'react'
import { useMutation, gql } from '@apollo/client'
import jwtDecode from 'jwt-decode'

const LOGOUT = gql`
  mutation logout($id: ID!) {
    logout(logoutInput: { _id: $id })
  }
`

let initialState = {
  user: null,
}

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

  initialState = {
    user: decodedToken,
  }
  // if (decodedToken.exp * 1000 < Date.now()) {
  //   RemoveRefreshToken(decodedToken._id)
  //   localStorage.removeItem('jwtToken')
  // } else {
  //   initialState = {
  //     user: decodedToken
  //   }
  // }
}

const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
})

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      }
    default:
      return state
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  function login(userData) {
    initialState.user = userData
    localStorage.setItem('jwtToken', initialState.user.token)
    // localStorage.setItem('refreshToken', initialState.user.refreshToken)
    dispatch({
      type: 'LOGIN',
      payload: userData,
    })
  }

  function logout() {
    localStorage.clear()
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        logout,
      }}
      {...props}
    />
  )
}

async function RemoveRefreshToken(userId) {
  const [signout] = useMutation(LOGOUT)

  try {
    await signout({
      variables: { id: userId },
    })
  } catch (error) {
    console.log(error)
  }
}

export { AuthContext, AuthProvider }
