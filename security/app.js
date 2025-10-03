require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');

const authRouter = require('./routes/auth');
const aclRouter = require('./routes/acl');

const app = express();

// CORS config
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'],
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'security' });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth', authRouter);
app.use('/api/acl', aclRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

module.exports = app;
