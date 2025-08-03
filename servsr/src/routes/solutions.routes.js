import express from 'express';
import { ObjectId } from 'mongodb';
const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  const solutions = await db.collection('solutions').find().toArray();
  res.json(solutions);
});

router.get('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const solution = await db.collection('solutions').findOne({ _id: new ObjectId(id) });
    if (!solution) return res.status(404).json({ error: 'Solution not found' });

    if (solution.competitors?.length) {
      const competitors = await db
        .collection('solutions')
        .find({ _id: { $in: solution.competitors.map(id => new ObjectId(id)) } })
        .toArray();
      solution.competitorData = competitors;
    }

    res.json(solution);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.post('/', async (req, res) => {
  const db = req.app.locals.db;
  const { name, description, category, url, releaseYear, versions = [] } = req.body;

  if (!name || !category) return res.status(400).json({ error: 'Missing required fields' });

  const result = await db.collection('solutions').insertOne({
    name,
    description,
    category,
    url,
    releaseYear,
    versions,
    competitors: [],
    createdAt: new Date(),
  });

  res.status(201).json({ _id: result.insertedId, name });
});

router.put('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { name, description, category, url, releaseYear, versions } = req.body;

  try {
    const result = await db.collection('solutions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          name,
          description,
          category,
          url,
          releaseYear,
          versions,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Solution not found' });
    res.json({ message: 'Solution updated' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.delete('/:id', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const result = await db.collection('solutions').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Solution not found' });

    res.json({ message: 'Solution deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.post('/:id/competitors', async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { competitorIds } = req.body;

  if (!Array.isArray(competitorIds))
    return res.status(400).json({ error: 'competitorIds must be an array' });

  try {
    const result = await db.collection('solutions').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          competitors: competitorIds.map(cid => new ObjectId(cid)),
        },
      }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: 'Solution not found' });
    res.json({ message: 'Competitors updated' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

router.post('/import', async (req, res) => {
  const db = req.app.locals.db;
  const data = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Expected array of solutions' });
  }

  try {
    const categorySet = new Set();
    data.forEach((item) => {
      (item.category || []).forEach((cat) => categorySet.add(cat));
    });

    const categoryNames = Array.from(categorySet);
    const uniqueCategories = categoryNames.map((name) => ({ name }));

    await db.collection('categories').insertMany(uniqueCategories);

    const insertedCategories = await db.collection('categories')
      .find({ name: { $in: categoryNames } })
      .toArray();

    const categoryMap = {};
    insertedCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id.toString();
    });

    const sanitizedSolutions = data.map((item) => ({
      name: item.name,
      description: item.description || '',
      categories: (item.category || []).map((catName) => categoryMap[catName]).filter(Boolean),
      url: item.url || '',
      releaseYear: item.releaseYear || null,
      versions: item.versions || [],
      competitors: [],
      createdAt: new Date(),
    }));

    const result = await db.collection('solutions').insertMany(sanitizedSolutions);

    res.status(201).json({
      insertedSolutions: result.insertedCount,
      insertedCategories: insertedCategories.length,
    });
  } catch (error) {
    console.error('Failed to import:', error);
    res.status(500).json({ error: 'Failed to import solutions and categories' });
  }
});

export default router;
