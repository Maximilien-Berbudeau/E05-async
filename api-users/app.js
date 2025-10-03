require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');

const usersRouter = require('./routes/users');

const app = express();

// Middlewares
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-users' });
});

// Routes
app.use('/api/users', usersRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
