import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Popover,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUser } from '../contexts/user';

const AccountPopover = ({ anchorEl, onClose }) => {
  const { t } = useTranslation();
  const open = Boolean(anchorEl);
  const { user, signout } = useUser();

  const handleLogout = async () => {
    try {
      await signout();
      onClose();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { p: 2, width: 250 } }}
    >
      <Stack spacing={1} alignItems="center">
        <Avatar sx={{ width: 56, height: 56 }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <Typography variant="subtitle1">{user?.name || t('unknown_user')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email || t('no_email')}
        </Typography>
      </Stack>

      <Divider sx={{ my: 1 }} />

      <Button fullWidth variant="outlined" onClick={handleLogout}>
        {t('login.logout')}
      </Button>
    </Popover>
  );
};

export default AccountPopover;
