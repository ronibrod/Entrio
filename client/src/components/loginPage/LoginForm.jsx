import React from 'react'
import {
  Alert,
  Button,
  FormControl,
  Stack,
  Typography,
  TextField,
  Divider,
} from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useUser } from '../../contexts/user'
import LanguagePopover from '../LanguagePopover'

export default function LoginForm() {
  const { signin, signup } = useUser()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [isSignup, setIsSignup] = React.useState(false)
  const [company, setCompany] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [submitError, setSubmitError] = React.useState(null)
  const [languageAnchorEl, setLanguageAnchorEl] = React.useState(null)

  const handleOpenLanguagePopover = (event) => {
    setLanguageAnchorEl(event.currentTarget)
  }
  const handleCloseLanguagePopover = () => {
    setLanguageAnchorEl(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = isSignup
        ? await signup(company, password)
        : await signin(company, password)

      if (user) return navigate('/dashboard', { replace: true })
    } catch (error) {
      if (error?.response?.status === 401) {
        setSubmitError('unauthorized')
      } else {
        setSubmitError('internal_server_error')
      }
      console.error(error)
    }
  }

  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center' }}>
      <Stack
        sx={{
          width: '100%',
          px: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3">
          {isSignup ? t('login.signup') : t('login.login')}
        </Typography>
        
        <Button onClick={handleOpenLanguagePopover}>
          <LanguageIcon />
        </Button>

        <LanguagePopover
          anchorEl={languageAnchorEl}
          onClose={handleCloseLanguagePopover}
        />
      </Stack>

      <form onSubmit={handleSubmit}>
        <Stack sx={{ width: 500 }}>
          <FormControl margin="normal">
            <TextField
              fullWidth
              id="company"
              name="company"
              label={t('login.company_name')}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </FormControl>

          <FormControl margin="dense">
            <TextField
              fullWidth
              id="password"
              name="password"
              label={t('login.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>

          {submitError && (
            <Alert severity="error" sx={{ my: 2 }}>
              {submitError === 'unauthorized'
                ? t('login.company_or_password_incorrect')
                : t('login.login_attempt_failed')}
            </Alert>
          )}

          <Button type="submit" variant="contained" sx={{ mt: 2 }}>
            {isSignup ? t('login.signup') : t('login.login')}
          </Button>

          <Button onClick={() => setIsSignup(!isSignup)} sx={{ mt: 1 }}>
            {isSignup ? t('login.have_account') : t('login.no_account')}
          </Button>
        </Stack>
      </form>
    </Stack>
  )
}
