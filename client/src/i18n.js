import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translations from './translations'

const resources = {
  'en-US': {
    translation: translations['en-US'],
  },
  'he-IL': {
    translation: translations['he-IL'],
  },
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
