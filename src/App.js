import React, { Component, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './scss/style.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'

import { AuthProvider } from './context/auth'
import { AuthRoute, AuthLogin } from './util/AuthRoute'

import { ToastContainer } from 'react-toastify'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/Login'))
const Page404 = React.lazy(() => import('./views/pages/Page404'))
const Page500 = React.lazy(() => import('./views/pages/Page500'))

class App extends Component {
  render() {
    return (
      <AuthProvider>
        <HashRouter>
          <Suspense fallback={loading}>
            <Routes>
              <Route
                exact
                path="/login"
                name="Login Page"
                element={
                  <AuthLogin>
                    <Login />
                  </AuthLogin>
                }
              />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route
                path="*"
                name="Home"
                element={
                  <AuthRoute>
                    <DefaultLayout />
                  </AuthRoute>
                }
              />
            </Routes>
          </Suspense>
          <ToastContainer />
        </HashRouter>
      </AuthProvider>
    )
  }
}

export default App
