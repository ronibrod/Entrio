import React from 'react'
import {
  Popover,
  MenuItem
} from '@mui/material'
import i18n from '../i18n'

const LanguagePopover = ({ anchorEl, onClose }) => {
  // const { t } = useTranslation()
  const open = Boolean(anchorEl);

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng)
    onClose()
  }

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleLanguageChange('en-US')}>English</MenuItem>
        <MenuItem onClick={() => handleLanguageChange('he-IL')}>עברית</MenuItem>
      </Popover>
    </>
  )
}

export default LanguagePopover
