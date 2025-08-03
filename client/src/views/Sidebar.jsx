import { useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Popover,
  Typography,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import AssessmentIcon from '@mui/icons-material/Assessment'
import CampaignIcon from '@mui/icons-material/Campaign'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SettingsIcon from '@mui/icons-material/Settings'
import LanguageIcon from '@mui/icons-material/Language'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import AccountPopover from '../components/AccountPopover'
import ComingSoonDialog from '../components/ComingSoonDialog'
import LanguagePopover from '../components/LanguagePopover'

const Sidebar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [accountAnchorEl, setAccountAnchorEl] = useState(null)
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null)
  const [comingSoonOpen, setComingSoonOpen] = useState(false)
  const handleComingSoonOpen = () => setComingSoonOpen(true)
  const handleComingSoonClose = () => setComingSoonOpen(false)
  const handleOpenAccountPopover = (event) => {
    setAccountAnchorEl(event.currentTarget)
  }
  const handleCloseAccountPopover = () => {
    setAccountAnchorEl(null)
  }
  const handleOpenLanguagePopover = (event) => {
    setLanguageAnchorEl(event.currentTarget)
  }
  const handleCloseLanguagePopover = () => {
    setLanguageAnchorEl(null)
  }

  return (
    <Box
      sx={{
        width: 220,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5',
        color: '#111',
        p: 2,
        boxShadow: '4px 0px 12px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Typography textAlign='center' variant="h4" gutterBottom>
        {'Entrio'}
      </Typography>

      <List>
        <ListItem button onClick={() => navigate('/dashboard')}>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t('dashboard')} />
        </ListItem>
        <ListItem button onClick={handleComingSoonOpen}>
          <ListItemIcon>
            <AnalyticsIcon />
          </ListItemIcon>
          <ListItemText primary={t('analytics')} />
        </ListItem>
        <ListItem button onClick={handleComingSoonOpen}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText primary={t('reports')} />
        </ListItem>
        <ListItem button onClick={handleComingSoonOpen}>
          <ListItemIcon>
            <CampaignIcon />
          </ListItemIcon>
          <ListItemText primary={t('marketing')} />
        </ListItem>
      </List>

      <Box flex={1} />

      <List sx={{ mt: 2 }}>
        <ListItem button onClick={handleComingSoonOpen}>
          <ListItemIcon>
            <HelpOutlineIcon />
          </ListItemIcon>
          <ListItemText primary={t('help')} />
        </ListItem>

        <ListItem button onClick={handleComingSoonOpen}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('settings')} />
        </ListItem>

        <ListItem button onClick={handleOpenLanguagePopover}>
          <ListItemIcon>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary={t('language')} />
        </ListItem>

        <ListItem button onClick={handleOpenAccountPopover}>
          <ListItemIcon>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary={t('account')} />
        </ListItem>

        <LanguagePopover
          anchorEl={languageAnchorEl}
          onClose={handleCloseLanguagePopover}
        />

        <AccountPopover
          anchorEl={accountAnchorEl}
          onClose={handleCloseAccountPopover}
        />
      </List>

      <ComingSoonDialog open={comingSoonOpen} onClose={handleComingSoonClose} />
    </Box>
  )
}

export default Sidebar
