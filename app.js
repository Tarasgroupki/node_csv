const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('./config');

const authRoutes = require('./routes/api/auth');
const ordersRoutes = require('./routes/api/orders');

mongoose.connect(
  `mongodb://${path.mongodb.username}:${
    path.mongodb.password
  }@${path.mongodb.uri}`,
  {
    useMongoClient: true,
  },
).then(() => {
  console.log('Connection to the Atlas Cluster is successful!');
}).catch((err) => console.error(err));

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({
      message: 'It works!',
    });
  }
  next();
});

// Routes which should handle requests
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  console.log(error);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
