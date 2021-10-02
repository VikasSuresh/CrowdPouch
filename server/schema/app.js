require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

require('../model');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes'));

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.send('Error');
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('Connected'); // eslint-disable-line no-console
}).catch((err) => {
  console.log('Cant Connect to DB', err); // eslint-disable-line no-console
  process.exit(-1);
});

module.exports = app;
