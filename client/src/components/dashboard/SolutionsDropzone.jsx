import { useState } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import axios from 'axios'

const DropArea = styled(Paper)(({ theme, isDragging }) => ({
  border: '2px dashed #aaa',
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragging ? '#f0f0f0' : '#fafafa',
  cursor: 'pointer',
}))

export default function SolutionsDropzone({ onUploadSuccess }) {
  const { t } = useTranslation()
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = async (event) => {
    event.preventDefault()
    setIsDragging(false)

    const file = event.dataTransfer.files[0]
    if (!file || file.type !== 'application/json') return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target.result)
        await axios.post('api/solutions/import', json)
        onUploadSuccess()
      } catch (err) {
        console.error('Upload failed:', err)
      }
    }
    reader.readAsText(file)
  }

  return (
    <Box
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <DropArea elevation={3} isDragging={isDragging}>
        <Typography variant="h6">{t('drop_json_here') || 'Drop JSON file here'}</Typography>
        <Typography variant="body2" color="textSecondary">
          {t('only_json_files') || 'Only .json files will be accepted'}
        </Typography>
      </DropArea>
    </Box>
  )
}
