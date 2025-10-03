const express = require('express');
const router = express.Router();

// GET all logs
router.get('/', async (req, res, next) => {
  try {
    const db = req.app.locals.db;
    const logs = await db.collection('logs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// GET logs by service
router.get('/service/:service', async (req, res, next) => {
  try {
    const { service } = req.params;
    const db = req.app.locals.db;
    const logs = await db.collection('logs')
      .find({ service })
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray();
    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// POST manual log
router.post('/', async (req, res, next) => {
  try {
    const { service, level, message } = req.body;
    const db = req.app.locals.db;
    
    const result = await db.collection('logs').insertOne({
      service,
      level: level || 'info',
      message,
      timestamp: new Date()
    });
    
    res.status(201).json({ id: result.insertedId });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

