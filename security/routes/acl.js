const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET permissions for user
router.get('/permissions/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT resource, action FROM permissions WHERE user_id = $1',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST check permission
router.post('/check', async (req, res, next) => {
  try {
    const { userId, resource, action } = req.body;
    
    const result = await pool.query(
      'SELECT * FROM permissions WHERE user_id = $1 AND resource = $2 AND action = $3',
      [userId, resource, action]
    );
    
    res.json({ allowed: result.rows.length > 0 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

