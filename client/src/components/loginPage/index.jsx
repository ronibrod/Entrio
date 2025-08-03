import React from 'react'
import { Paper, Stack } from '@mui/material'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Stack
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100dvw',
        height: '100dvh',
        bgcolor: '#f5f5f5',
      }}
    >
      <Paper
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: '4px 0px 12px rgba(0, 0, 0, 0.1)',
          p: 4,
        }}
      >
        <div style={{ marginTop: '30px' }}>
          <LoginForm />
        </div>
      </Paper>
    </Stack>
  )
}
