import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.locals.db;

  try {
    const categories = await db.collection('categories').find().toArray();
    const solutions = await db.collection('solutions').find({}, { projection: { categories: 1, category: 1 } }).toArray();

    const categoryCountMap = {};
    solutions.forEach(solution => {
      const catIds = solution.categories || solution.category || [];
      (Array.isArray(catIds) ? catIds : []).forEach(catId => {
        const key = catId.toString();
        categoryCountMap[key] = (categoryCountMap[key] || 0) + 1;
      });
    });

    const categoriesWithCount = categories.map(cat => ({
      ...cat,
      count: categoryCountMap[cat._id.toString()] || 0,
    }));

    categoriesWithCount.sort((a, b) => b.count - a.count);
    res.json(categoriesWithCount);
  } catch (err) {
    console.error('Failed to fetch categories with count:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const { name, description } = req.body;

  if (!name) return res.status(400).json({ error: 'Name is required' });

  const result = await db.collection('categories').insertOne({
    name,
    description: description || '',
    createdAt: new Date(),
  });

  res.status(201).json({ _id: result.insertedId, name });
});

router.put('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.delete('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const result = await db.collection('categories').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Category not found' });

    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

export default router;
