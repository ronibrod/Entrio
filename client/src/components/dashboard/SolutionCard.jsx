import React from 'react'
import { Card, CardContent, Typography, Button, Stack, Divider } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SolutionDialog from './SolutionDialog'

const SolutionCard = ({ solution, categories, fetchSolutions }) => {
  const { t } = useTranslation()
  const [categoriesNames, setCategoriesNames] = React.useState([])
  const [openDialog, setOpenDialog] = React.useState(false)
  const [selectedSolution, setSelectedSolution] = React.useState(null)

  const handleOpenDialog = (solution) => {
    setSelectedSolution(solution)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedSolution(null)
  }

  React.useEffect(() => {
    const relevantCategories = categories?.filter((c) =>
      solution.categories.includes(c._id)
    ) || []
    setCategoriesNames(relevantCategories.map((c) => c.name))
  }, [categories, solution.categories])

  return (
    <Card
      sx={{
        height: '35vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Stack>
          <Typography textAlign="center" variant="h6" fontWeight="bold">
            {solution.name}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {solution.description || t('no_description')}
          </Typography>
          {categoriesNames.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {t('categories')}: {categoriesNames.join(', ')}
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {t('year')}: {solution.releaseYear || '-'}
          </Typography>
        </Stack>
      </CardContent>
      <Button
        variant="text"
        sx={{ mt: 1, mx: 2, mb: 2, bgcolor: '#f5f5f5' }}
        onClick={() => handleOpenDialog(solution)}
      >
        {t('view')}
      </Button>
      <SolutionDialog
        open={openDialog}
        onClose={handleCloseDialog}
        solution={selectedSolution}
        categories={categories}
        onDelete={(id) => {
          handleCloseDialog()
          fetchSolutions()
        }}
        onSave={(updated) => {
          handleCloseDialog()
          fetchSolutions()
        }}
      />
    </Card>
  )
}

export default SolutionCard
