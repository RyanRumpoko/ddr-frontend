import React, { createContext, useReducer } from 'react'
import jwtDecode from 'jwt-decode'

let initialState = {
  user: null,
}

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken')
  } else {
    initialState = {
      user: decodedToken,
    }
  }
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

export { AuthContext, AuthProvider }
