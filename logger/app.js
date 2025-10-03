require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const { MongoClient } = require('mongodb');
const redis = require('redis');

const logsRouter = require('./routes/logs');

const app = express();

// MongoDB connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017';
const mongoClient = new MongoClient(mongoUrl);
let db;

mongoClient.connect()
  .then(client => {
    db = client.db(process.env.MONGO_DB || 'logs_db');
    console.log('Connected to MongoDB');
    app.locals.db = db;
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Redis subscriber
const subscriber = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

subscriber.connect()
  .then(() => {
    console.log('Connected to Redis');
    subscriber.subscribe('logs', (message) => {
      if (db) {
        const log = JSON.parse(message);
        db.collection('logs').insertOne({
          ...log,
          timestamp: new Date()
        });
      }
    });
  })
  .catch(err => console.error('Redis connection error:', err));

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'logger' });
});

app.use('/api/logs', logsRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
