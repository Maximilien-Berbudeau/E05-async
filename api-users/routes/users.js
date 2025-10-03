const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all users
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT id, name, email, role, status FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET user by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, name, email, role, status FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST create user
router.post('/', async (req, res, next) => {
  try {
    const { name, email, role = 'user', status = 'active' } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO users (name, email, role, status) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, status',
      [name, email, role, status]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT update user
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    
    const result = await pool.query(
      'UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), role = COALESCE($3, role), status = COALESCE($4, status) WHERE id = $5 RETURNING id, name, email, role, status',
      [name, email, role, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE user
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
