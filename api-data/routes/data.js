const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all data items
router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM data_items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// GET data item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM data_items WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST create data item
router.post('/', async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const result = await pool.query(
      'INSERT INTO data_items (title, content, category) VALUES ($1, $2, $3) RETURNING *',
      [title, content, category || 'general']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT update data item
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category } = req.body;
    
    const result = await pool.query(
      'UPDATE data_items SET title = COALESCE($1, title), content = COALESCE($2, content), category = COALESCE($3, category) WHERE id = $4 RETURNING *',
      [title, content, category, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE data item
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM data_items WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data item not found' });
    }
    
    res.json({ message: 'Data item deleted successfully', id: result.rows[0].id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

