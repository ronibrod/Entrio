import express from 'express';
import bcrypt from 'bcrypt';
import { generateAccessTokenData } from '../middlewares/auth.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const db = req.app.locals.db;
  const { company, password } = req.body;

  if (!company || !password) {
    return res.status(400).json({ error: 'Missing company or password' });
  }

  const existing = await db.collection('users').findOne({ company });
  if (existing) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { company, password: hashedPassword };

  const result = await db.collection('users').insertOne(newUser);

  const { token, exp } = generateAccessTokenData({
    _id: result.insertedId.toString(),
    company,
  });

  res.status(201).json({ token, exp });
});

router.post('/login', async (req, res) => {
  const db = req.app.locals.db;
  const { company, password } = req.body;

  const user = await db.collection('users').findOne({ company });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const { token, exp } = generateAccessTokenData({
    _id: user._id.toString(),
    company: user.company,
  });

  res.status(200).json({ token, exp });
});

router.get('/me', authenticateToken, (req, res) => {
  res.status(200).json(req.user || null);
});

export default router;
