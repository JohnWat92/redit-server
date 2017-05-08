const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const json = require('body-parser').json;
const Pool = require('pg').Pool;
const path = require('path');
const pg = require('pg');

const pool = new Pool({
  user: 'reditscratch',
  password: '12345',
  database: 'reditscratch',
  part:'5432',
  host: 'localhost'
});

module.exports = pool;

const apiRouter = new express.Router();
const authRouter = new express.Router();

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

app.use('/api', apiRoutes(apiRouter));
app.use('/auth', authRoutes(authRouter));

app.use(cors());
app.use(cookieParser());
app.use(json());

// FINDS WHETHER OR NOT LOGIN DETAILS EXISTS IN THE DATABASE

app.listen(3001, function () {
  console.log('Example app listening on port 3001!')
});
