import { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import Axios from 'axios'
import SolutionsDropzone from './SolutionsDropzone'
import SolutionCard from './SolutionCard'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline' // אייקון למחיקה

const DashboardManagement = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [solutions, setSolutions] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchSolutions = async () => {
    try {
      setLoading(true)
      const { data } = await Axios.get('/api/solutions')
      setSolutions(data)
    } catch (err) {
      console.error('Error fetching solutions:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const { data } = await Axios.get('/api/categories')
      setCategories(data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  useEffect(() => {
    fetchSolutions()
    fetchCategories()
  }, [])

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    )
  }

  const clearSelectedCategories = () => {
    setSelectedCategories([])
  }

  const filteredSolutions = solutions.filter((s) => {
    const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategories =
      selectedCategories.length === 0 ||
      (Array.isArray(s.categories) && s.categories.some((catId) => selectedCategories.includes(catId)))
    return matchesSearch && matchesCategories
  })

  return (
    <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', bgcolor: '#eee', p: 2 }}>
      <Stack width="100%" px={2} direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{t('dashboard')}</Typography>
      </Stack>

      <Divider variant="middle" sx={{ width: '100%', mb: 2 }} />

      <Stack width="100%" px={2}>
        <TextField
          fullWidth
          label={t('search')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            width: '100%',
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
              backgroundColor: '#f5f5f5',
              color: 'black',
              '& input': {
                color: 'black',
              },
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#555',
            },
            '& .Mui-focused .MuiInputLabel-root': {
              color: '#333',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack width="84vw" bgcolor="#f5f5f5" borderRadius={2} px={2} pt={2} flexDirection='row'>
        <Box
          sx={{
            width: '97%',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <Box sx={{ display: 'inline-flex', gap: 1, px: 1, pb: 2, alignItems: 'center' }}>
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category._id)
              return (
                <Chip
                  key={category._id}
                  label={category.name}
                  onClick={() => toggleCategory(category._id)}
                  variant={isSelected ? 'filled' : 'outlined'}
                  sx={{
                    bgcolor: isSelected ? '#2196f3' : '#ffffff',
                    color: isSelected ? '#fff' : '#333',
                    fontWeight: 500,
                    boxShadow: 1,
                    borderRadius: '16px',
                    px: 1.5,
                    py: 0.5,
                    '&:hover': {
                      bgcolor: isSelected ? '#1976d2' : '#e0e0e0',
                      cursor: 'pointer',
                    },
                  }}
                  size="small"
                />
              )
            })}


          </Box>
        </Box>
        {selectedCategories.length > 0 && (
          <IconButton onClick={clearSelectedCategories} size="small" sx={{ mt: -1, ml: 1 }}>
            <DeleteOutlineIcon />
          </IconButton>
        )}
      </Stack>

      <Stack width='100%'>
        <Typography variant="h6" py={1} px={4}>{t('all_solutions')}</Typography>
        <Divider variant="middle" sx={{ width: '100%', mb: 2 }} />
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredSolutions.length === 0 ? (
        <SolutionsDropzone onUploadSuccess={fetchSolutions} />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            overflowY: 'auto',
          }}
        >
          {filteredSolutions.map((solution) => (
            <Box
              key={solution._id}
              sx={{
                flex: '0 1 18%',
                minWidth: 200,
                maxWidth: 320,
              }}
            >
              <SolutionCard
                solution={solution}
                categories={categories}
                fetchSolutions={fetchSolutions}
              />
            </Box>
          ))}
        </Box>
      )}
    </Stack>
  )
}

export default DashboardManagement
