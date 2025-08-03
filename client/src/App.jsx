import axios from 'axios'
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box, CssBaseline } from '@mui/material'
import { useUser } from './contexts/user'
import LoginPage from './components/loginPage'
import ViewWrapper from './views/ViewWrapper'
import DashboardManagement from './components/dashboard'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL

const ProtectedRoute = ({ children }) => {
  const { user, initialLoad } = useUser()
  const location = useLocation()

  if (!initialLoad) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return children
}

const App = () => {
  const { user, initialLoad } = useUser()

  if (!initialLoad) return null

  return (
    <BrowserRouter>
      <CssBaseline />
      <Box sx={{ width: '100vw', height: '100%'}}>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />

          <Route
            path="/"
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ViewWrapper />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardManagement />} />
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  )
}

export default App