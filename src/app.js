const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path');
const pg = require('pg');
const json = require('body-parser').json;

const postgresClient = new pg.Client({
  user: 'reditscratch',
  password: 'redacademy',
  database: 'reditscratch',
  port:5432,
  host:'localhost'
});

postgresClient.connect((err) => {
  if (err) throw err;

  app.use(express.static('./'));
  console.log('connected to postgres...');
  app.use(json());
  // FINDS WHETHER OR NOT LOGIN DETAILS EXISTS IN THE DATABASE
  app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username='${username}' AND password=crypt('${password}', password);`
    postgresClient.query(query, (err, user) => {
      console.log(err, user);
      if(user.rows.length) return res.status(200).send();
      return res.status(403).send('Invalid username or password...');
    });
  });

  app.get('/posts', (req, res) => {
    postgresClient.query('SELECT * FROM posts', (err, posts) => {
     if (err) return res.status(500);
     return res.status(200).json(posts.rows);
    });
  });

  app.get('/weeks', (req, res) => {
    postgresClient.query('SELECT * FROM weeks', (err, weeks) => {
      if(err) return res.status(500).send();
      postgresClient.query('SELECT * FROM lessons', (err, lessons) => {
        const response = weeks.rows.map( week => {
          return {
            title:week.title,
            lessons: lessons.rows.filter(lesson => lesson.week_id === week.id)
          };
        });
        res.status(200).send(response);
      });
    });
  });

  app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
  });
});

// import express from 'express';
// import { resolve } from 'path';

// import fallback from 'express-history-api-fallback';

// import config from '../config'

// const root = resolve(process.cwd(), config.get('STATIC_PATH'));
// const app = express();

// app.use(express.static(root));

// app.use(fallback('index.html', { root }));

// app.use((req, res, next) => {
//   res.status(404).send('Page not found...');
//   next();
// });

// module.exports = app;
