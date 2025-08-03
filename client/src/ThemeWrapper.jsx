import React, { useMemo, useEffect } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import stylisRTLPlugin from 'stylis-plugin-rtl'

const createEmotionCache = (isRTL) =>
  createCache({
    key: isRTL ? 'mui-rtl' : 'mui',
    stylisPlugins: isRTL ? [stylisRTLPlugin] : [],
  })

export default function ThemeWrapper({ children }) {
  const { i18n } = useTranslation()
  const direction = i18n.dir()
  const isRTL = direction === 'rtl'

  useEffect(() => {
    document.documentElement.setAttribute('dir', direction)
  }, [direction])

  const theme = useMemo(() => createTheme({ direction }), [direction])
  const cache = useMemo(() => createEmotionCache(isRTL), [isRTL])

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  )
}
