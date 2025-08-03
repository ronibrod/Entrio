import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  IconButton,
  TextField,
  Chip,
  Autocomplete,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Axios from 'axios'
import { useTranslation } from 'react-i18next'

const SolutionDialog = ({ open, onClose, solution, categories, onDelete, onSave }) => {
  const { t } = useTranslation()
  const [editableSolution, setEditableSolution] = React.useState(solution || {})

  React.useEffect(() => {
    setEditableSolution(solution || {})
  }, [solution])

  const handleChange = (field) => (event) => {
    setEditableSolution((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSave = async () => {
    try {
      await Axios.put(`/api/solutions/${editableSolution._id}`, editableSolution)
      onSave?.(editableSolution)
    } catch (err) {
      console.error('Failed to save solution:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await Axios.delete(`/api/solutions/${solution._id}`)
      onDelete?.(solution._id)
    } catch (err) {
      console.error('Failed to delete solution:', err)
    }
  }

  const handleRemoveCategory = (idToRemove) => {
    setEditableSolution((prev) => ({
      ...prev,
      categories: prev.categories?.filter((id) => id !== idToRemove),
    }))
  }

  const handleAddCategory = (categoryToAdd) => {
    if (!categoryToAdd || !categoryToAdd._id) return
    setEditableSolution((prev) => ({
      ...prev,
      categories: [...(prev.categories || []), categoryToAdd._id],
    }))
  }

  const selectedCategoryObjects =
    categories?.filter((cat) => editableSolution.categories?.includes(cat._id)) || []

  const availableCategories = categories?.filter(
    (cat) => !editableSolution.categories?.includes(cat._id)
  ) || []

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {solution?.name || t('solution')}
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label={t('name')}
            fullWidth
            value={editableSolution.name || ''}
            onChange={handleChange('name')}
          />
          <TextField
            label={t('description')}
            fullWidth
            multiline
            minRows={3}
            value={editableSolution.description || ''}
            onChange={handleChange('description')}
          />
          <TextField
            label={t('release_year')}
            type="number"
            fullWidth
            value={editableSolution.releaseYear || ''}
            onChange={handleChange('releaseYear')}
          />

          <Typography variant="body2" color="text.secondary">
            {t('categories')}:
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1}>
            {selectedCategoryObjects.map((cat) => (
              <Chip
                key={cat._id}
                label={cat.name}
                onDelete={() => handleRemoveCategory(cat._id)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>

          <Autocomplete
            options={availableCategories}
            getOptionLabel={(option) => option.name}
            onChange={(e, newValue) => handleAddCategory(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={t('add_category')} variant="outlined" />
            )}
            disableClearable
            size="small"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleDelete} color="error">
          {t('delete')}
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SolutionDialog
