import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/', async (req, res) => {
  const db = req.app.locals.db;
  const { title, categoryId, year } = req.query;

  const filter = {};

  if (title) {
    filter.title = { $regex: new RegExp(title, 'i') };
  }

  if (categoryId) {
    try {
      filter.categoryId = new ObjectId(categoryId);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
  }

  if (year) {
    const yearInt = parseInt(year);
    if (!isNaN(yearInt)) {
      filter.year = yearInt;
    }
  }

  try {
    const solutions = await db.collection('solutions').find(filter).toArray();
    res.json(solutions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
