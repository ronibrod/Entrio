import React from 'react'
import { Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'

const ViewWrapper = () => {
  return (
    <Box sx={{ display: 'flex', height: '100dvh', width: '100%', flexGrow: 1 }}>
      <CssBaseline />
      <Sidebar />
      <Box flex={1}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default ViewWrapper
